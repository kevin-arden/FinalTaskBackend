const { Users } = require("../../models");

exports.getUsers = async (req, res) => {
  try {
    const user = await Users.findAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    res.send({
      messages: "Success",
      data: {
        user,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};

exports.getSingleUser = async (req, res) => {
  try {
    const { id } = req.user;
    const users = await Users.findOne({
      where: { id },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    res.send({
      messages: "success",
      data: {
        users,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};

exports.editUser = async (req, res) => {
  try {
    const { id } = req.user;
    const users = await Users.findOne({
      where: { id },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    await Users.update(
      {
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        // avatar: req.files.avatar[0].filename,
      },
      { where: { id } }
    );

    const user = await Users.findOne({
      where: { id },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    res.send({
      messages: "User Successfully Edited",
      data: {
        user,
      },
    });
  } catch (err) {}
};
