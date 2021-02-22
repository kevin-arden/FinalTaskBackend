const {
  Transactions,
  TransactionBooks,
  Users,
  Books,
} = require("../../models");

exports.getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transactions.findOne({
      where: { id },
      include: [
        {
          model: Users,
          as: "user",
          attributes: {
            exclude: [
              "email",
              "password",
              "role",
              "gender",
              "phone",
              "address",
              "avatar",
              "createdAt",
              "updatedAt",
            ],
          },
        },
        {
          model: Books,
          through: TransactionBooks,
        },
      ],
      attributes: {
        exclude: ["usersId", "createdAt", "updatedAt"],
      },
    });

    if (!transaction) {
      return res.status(400).send({
        status: "Server Error",
        error: {
          message: "Data Transaction Not Found",
        },
      });
    }

    res.send({
      messages: "Transaction Successfully Retrieved",
      data: {
        transaction,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transactions.findAll({
      include: [
        {
          model: Users,
          required: true,
          as: "user",
          attributes: {
            exclude: [
              "email",
              "password",
              "role",
              "gender",
              "phone",
              "address",
              "avatar",
              "createdAt",
              "updatedAt",
            ],
          },
        },
        { model: Books, through: TransactionBooks },
      ],
      attributes: {
        exclude: ["usersId", "createdAt", "updatedAt"],
      },
    });

    if (!transactions) {
      return res.status(400).send({
        status: "Server Error",
        error: {
          message: "Data Transaction Not Found",
        },
      });
    }

    res.send({
      messages: "Transaction Successfully Retrieved",
      data: {
        transactions,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};

exports.addTransactions = async (req, res) => {
  try {
    const data = await Transactions.create({
      usersId: req.user.id,
      attachment: req.files.attachment[0].filename,
      totalPayment: req.body.totalPayment,
      bookCart: req.body.bookCart,
      status: "Pending",
      
    });

    const bookCart2 = req.body.bookCart;
    const bookCart = JSON.parse("[" + bookCart2 + "]");

    bookCart.map(async (book) => {
      let id = book;

      try {
        const input = await TransactionBooks.create({
          TransactionId: data.id,
          BookId: id,
        });
        console.log(input);
      } catch (err) {
        console.log(err);
        res.status(500).send({
          message: "Server Error",
        });
      }
    });

    const transaction = await Transactions.findOne({
      where: { id: data.id },
      include: [
        {
          model: Users,
          as: "user",
          attributes: {
            exclude: [
              "email",
              "password",
              "role",
              "gender",
              "phone",
              "address",
              "avatar",
              "createdAt",
              "updatedAt",
            ],
          },
        },
         
      ],
      attributes: {
        exclude: ["usersId", "createdAt", "updatedAt"],
      },
    });

    res.send({
      messages: "Transaction Successfully Added",
      data: {
        transaction,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};

exports.editTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction2 = await Transactions.findOne({
      where: { id },
    });

    if (!transaction2) {
      return res.status(400).send({
        status: "Server Error",
        error: {
          message: "Data Transaction Not Found",
        },
      });
    }

    await Transactions.update(
      {
        status: req.body.status,
      },
      {
        where: { id },
      }
    );

    const bookOwned2 = transaction2.bookCart.replace(/\"/g, "");

    if (req.body.status === "Approved") {
      const input = await Users.update(
        {
          bookOwned: bookOwned2,
        },
        {
          where: { id: transaction2.usersId },
        }
      );
      console.log(input);
    }

    const transaction = await Transactions.findOne({
      where: { id },
      include: {
        model: Users,
        as: "user",
        attributes: {
          exclude: ["email", "password", "role", "createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["usersId", "createdAt", "updatedAt"],
      },
    });

    res.send({
      messages: "Transaction Successfully Edited",
      data: {
        transaction,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};
