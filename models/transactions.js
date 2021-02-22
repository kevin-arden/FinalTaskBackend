"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transactions.belongsToMany(models.Books, {
        through: {
          model: "TransactionBooks",
          as: "books",
        },
      });

      Transactions.belongsTo(models.Users, {
        as: "user",
        foreignKey: "usersId",
      });
    }
  }
  Transactions.init(
    {
      usersId: DataTypes.INTEGER,
      attachment: DataTypes.STRING,
      totalPayment: DataTypes.INTEGER,
      status: DataTypes.STRING,
      bookCart: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "Transactions",
    }
  );
  return Transactions;
};
