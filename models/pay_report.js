// 결제 시스템은 shortid 사용하면 겹칠 위험때문에 쓰면 안되고 uuid 등 절대 안겹치는거 써야함.
// 본 프로젝트에서 적용할 에정 이건 미니니까 냅둠
const shortid = require("shortid");

module.exports = (sequelize, DataTypes) => {
  const pay_report = sequelize.define(
    "pay_report",
    {
      id: {
        type: DataTypes.STRING(200),
        primaryKey: true,
        allowNull: true,
        unique: true,
      },
      user_id: { 
       type: DataTypes.STRING(180),
        allowNull: true
      },
      imp_uid: {
        type: DataTypes.STRING(180),
        allowNull: true
      },
      pay_method: {
       type: DataTypes.STRING(180),
        allowNull: true
      },
      merchant_uid: {
        type: DataTypes.STRING(180),
        allowNull: true
      },
      paid_amount: {
        type: DataTypes.STRING(180),
        allowNull: true
      },
      buyer_name: {
        type: DataTypes.STRING(180),
        allowNull: true
      },
      buyer_email: {
        type: DataTypes.STRING(180),
        allowNull: true
      },
      buyer_tel: {
        type: DataTypes.STRING(180),
        allowNull: true
      },
      buyer_addr: {
        type: DataTypes.STRING(180),
        allowNull: true
      },
      buyer_postcode: {
        type: DataTypes.STRING(180),
        allowNull: true
      },
      card_name: {
        type: DataTypes.STRING(180),
        allowNull: true
      },
      bank_name: {
        type: DataTypes.STRING(180),
        allowNull: true
      },
      card_quota: {
        type: DataTypes.STRING(180),
        allowNull: true
      },
      card_number: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      // 0 : 정상 결제 / 1 : 결제 전 / 2 : 결제 취소  로 관리해야 함
      is_complete: {
        type: DataTypes.STRING(2),
        allowNull: false
      },
      cancel_reason: {
         type: DataTypes.STRING(100),
        allowNull: true
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      comment: "결제 정보",
    }
  );

  pay_report.beforeCreate((pay_report, options) => {
    const pri_id = shortid.generate();
    idok = shortid.isValid(pri_id);
    if (!idok) {
      pri_id = pri_id + Math.random().toString(36).substring(2, 4);
    }
    return (pay_report.id = pri_id);
  });
  return pay_report;
  };
