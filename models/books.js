'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Books extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Books.belongsToMany(models.Transactions, {
        through: {
          model: "TransactionBooks",
          as: "transactions",
        },
      });
    }
  };
  Books.init({
    title: DataTypes.STRING,
    publicationDate: DataTypes.DATE,
    pages: DataTypes.INTEGER,
    isbn: DataTypes.INTEGER,
    author: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    bookAttachment: DataTypes.STRING,
    image_id: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Books',
  });
  return Books;
};