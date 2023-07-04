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
        allowNull: false
      },
      pay_method: {
       type: DataTypes.STRING(180),
        allowNull: true
      },
      merchant_uid: {
        type: DataTypes.STRING(180),
        allowNull: true
      },
      name: {
        type: DataTypes.STRING(180),
        allowNull: true
      },
      paid_amount: {
        type: DataTypes.STRING(180),
        allowNull: true
      },
      currency: {
        type: DataTypes.STRING(180),
        allowNull: true
      },
      pg_provider: {
        type: DataTypes.STRING(180),
        allowNull: true
      },
      pg_type: {
        type: DataTypes.STRING(180),
        allowNull: true
      },
      pg_tid: {
        type: DataTypes.STRING(180),
        allowNull: true
      },
      apply_num: {
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
      custom_data: {
        type: DataTypes.STRING(180),
        allowNull: true
      },
      status: {
        type: DataTypes.STRING(180),
        allowNull: true
      },
      paid_at: {
        type: DataTypes.STRING(180),
        allowNull: true
      },
      receipt_url: {
         type: DataTypes.STRING(200),
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
      is_cancel: {
         type: DataTypes.BOOLEAN,
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
