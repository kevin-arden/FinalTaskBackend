const { Books } = require("../../models");

exports.getBooks = async (req, res) => {
  try {
    const book = await Books.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      messages: "Success",
      data: {
        book,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};

exports.getPromoBooks = async (req, res) => {
  try {
    const { Op } = require("sequelize");
    const book = await Books.findAll({
      where: {
        price: { [Op.lt]: 150000 },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      messages: "Success",
      data: {
        book,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};

exports.getDetailBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Books.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!book) {
      return res.send({
        message: `Book with id ${id} is not found`,
      });
    }

    res.send({
      status: `Book With id ${id} Successfully Found`,
      data: {
        book,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};

exports.downloadBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Books.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!book) {
      return res.send({
        message: `Book with id ${id} is not found`,
      });
    }

    res.download(book.bookAttachment);

    res.send({
      status: `Book With id ${id} Successfully Found`,
      data: {
        book,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};

exports.addBook = async (req, res) => {
  try {
    console.log(req);
    const createBook = await Books.create({
      title: req.body.title,
      publicationDate: req.body.publicationDate,
      pages: req.body.pages,
      isbn: req.body.isbn,
      author: req.body.author,
      price: req.body.price,
      description: req.body.description,
      bookAttachment: req.files.bookAttachment.filename,
      thumbnail: req.files.attachment.filename,
    });

    const book = await Books.findOne({
      where: { id: createBook.id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      message: "Book successfully added",
      data: {
        book,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};
