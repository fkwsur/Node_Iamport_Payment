const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes, Op, QueryTypes } = require("sequelize");
const basename = path.basename(__filename);
const dotenv = require('dotenv');
dotenv.config();

const { DB_DATABASE,DB_USER,DB_PASSWORD,DB_HOST } = process.env;

const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
  operatorsAliases: 0,
  timezone: "+09:00",
  dialectOptions: {
    charset: "utf8mb4",
    dateStrings: true,
    typeCast: true,
  },
  pool: {
    max: 10,
    min: 5,
    idle: 10000,
    acquire: 60000,
  },
});

let db = [];

fs
  .readdirSync(__dirname)
  .filter(file => {
    // 파일이름 추출
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js"
    );
  })
  // 추출한 값을 하나하나하나 db[]안에 담음
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

//외래키 있으면 외래키끼리 연결시켜줌
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// sequelize, Op, QueryTypes 사용을 위한 선언
db.sequelize = sequelize;
db.Op = Op;
db.QueryTypes = QueryTypes;

// 내보내기
module.exports = db;