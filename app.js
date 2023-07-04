const fastify = require('fastify');
const app = fastify({
  logger: true
})

const cors = require('@fastify/cors');
app.register(cors, { origin: '*' })

const router = require('./routes');
const dotenv = require('dotenv');
dotenv.config();
const db = require("./models");


const check_mysql_health = async () => {
  setInterval(async () => {
    try {
      await db.sequelize.authenticate();
    } catch (error) {
      console.log("db ping error : ", error);
    }
  }, 60000 * 3);
};
// mysql + sequelize
db.sequelize
  .authenticate()
  .then(async () => {
    try {
      const { sequelize } = require("./models");
      await sequelize.sync(true);
      console.log("db connect ok");
    } catch (err) {
      console.log("seq:", err);
    }
  })
  .catch(async (err) => {
    console.log("db" + err);
    process.exit(0);
  });

app.register(router.userRouter, { prefix: "/api/v1/user" });
app.register(router.payReportRouter, { prefix: "/api/v1/payment" });

app.listen({ port: 8081 }, (err) => { if (err) throw err }, () => {
  console.log("running on port 8081");
});

check_mysql_health();