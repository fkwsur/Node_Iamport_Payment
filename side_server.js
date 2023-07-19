const fastify = require('fastify');
const app = fastify({
  logger: true
})
const cors = require('@fastify/cors');
app.register(cors, { origin: '*' })
const dotenv = require('dotenv');
dotenv.config();
const { Kafka } = require("kafkajs");
const kafka = new Kafka({
    clientId: "kafka-client",
    brokers: [`${process.env.BROKER}:9092`],
});

app.get('/api/v1/payment/sendside', async (req, res) => {
    try {
        let {payment, user_id} = req.body;
        // user_id 토큰 해쉬하는 로직 있어야 함
        const data = JSON.stringify(payment)
        await producer.send({
          topic: "iamport_kafka",
          messages: [
              {
              value : Buffer.from(data)
          }],
        });
        return res.code(200).send({result : "success"});
    } catch (error) {
        return res.code(200).send({error : error});
    }
  })


  const consumer = kafka.consumer({ groupId: "payment_consumer" });

  const consumerRun = async () => {
      await consumer.connect();
      await consumer.subscribe({ topic: "iamport-kafka", fromBeginning: true });
      await consumer.run({
          eachMessage: async({topic, partition, message}) => {
              let data = await JSON.parse(message.value.toString())
                  try {
                    // 본 서버로 카프카 데이터 꺼내서 요청
                    await axios.post('http://localhost:8081/api/v1/payment/accept', {
                        payment : data,
                        user_id : "hjhj"
			        })
                   } catch (err) {
                    // 통신 실패하면 다시 카프카에 담기
                    await producer.send({
                      topic: "iamport_kafka",
                      messages: [
                          {
                          value : message.value
                      }],
                    });
                   }
          }
      })
  }

app.listen({ port: 8082 }, (err) => { if (err) throw err }, () => {
    console.log("running on port 8082");
  });

consumerRun().catch(err => console.log("kafka err : ", err))



