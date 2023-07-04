module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      idx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      Username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      Password: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      freezeTableName: true,
      timestamps: true,
      comment: '유저 정보',
    }
  );
  return user;
};