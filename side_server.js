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

const consumer = kafka.consumer({ groupId: "payment_consumer" });

let globalArr = [];
const timer = (i) => {
  setTimeout(async() => {
    console.log("checkVal :", i, "globalArr : ", globalArr.length);
    if (i == globalArr.length) {
      try {
        const rows = await CarLiftLog.insertMany( globalArr );
        console.log(rows)
        globalArr = [];
        } catch (err) {
          console.log(err, "잘못된 데이터로 인해 넣기 실패")
       }
    }
  }, 1000);
}

const consumerRun = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: "iamport-kafka", fromBeginning: true });
    await consumer.run({
        eachMessage: async({topic, partition, message}) => {
            let data = await JSON.parse(message.value.toString())
            globalArr.push(data)
            timer(globalArr.length.toString());
            //맞이줘봐야 1000개 미만이 현재 몽고디비한텐 적절함.
            // => 현장추가될때마다 숫자 바꿔주다가 너무 많으면 몽고디비 스팩을 올림
            if (globalArr.length == 500 ) { 
                //mongodb bulk
                try {
                    // 통신으로 서버에 데이터 날리는 부분
                    console.log(rows)
                    globalArr = [];
                 } catch (err) {
                    console.log(err, "잘못된 데이터로 인해 넣기 실패")
                 }
            }
        }
    })
}


app.get('/', async (request, reply) => {
    try {
        let {payment, user_id} = req.body;
        const getToken = await axios.post('https://api.iamport.kr/users/getToken', {
            imp_key : process.env.imp_key,
            imp_secret : process.env.imp_secret
        })
        // 실제로 결제내역이 있는지 아이엠포트 서버에서 확인
        const retval = await axios.post(util.format('https://api.iamport.kr/payments/%s',payment.imp_uid),{
        }, {
            headers: {
                Authorization: getToken.data.response.access_token,
            }
        });
        // 아이엠포트 서버에 결제내역이 없을 경우
        if (retval.data.response.status != "paid") {
            throw "에러";
        }
        // 아이엠포트 서버상의 가격과 유저의 요청 가격 맞는지 비교
        if(retval.data.response.amount != payment.paid_amount){
            throw "에러";
        }
        // 이전 결재대기 로직 불러와서 결재완료 시키기
        const rows = await pay_report.update({
            is_complete :  0,
            imp_uid : payment.imp_uid
          },{
            where :{user_id : user_id, merchant_uid : payment.merchant_uid}
          })
          console.log(rows)
          if(rows) return res.code(200).send({result : true});
        else throw "에러";
    } catch (error) {
        return res.code(200).send({error : error});
    }
  })

app.listen({ port: 8082 }, (err) => { if (err) throw err }, () => {
    console.log("running on port 8081");
  });

consumerRun().catch(err => console.log("kafka err : ", err))



