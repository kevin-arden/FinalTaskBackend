const { Users } = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const schema = Joi.object({
      email: Joi.string().email().min(6).required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        error: error.details[0].message,
      });

    const user = await Users.findOne({
      where: { Email: email },
    });

    if (!user)
      return res.status(400).send({
        message: "Your Credentials Is not Valid",
      });

    const validPass = await bcrypt.compare(password, user.password);

    if (!validPass)
      return res.status(400).send({
        message: "Your Credentials Is not Valid",
      });

    const secretKey = "secret-key";
    const token = jwt.sign(
      {
        id: user.id,
      },
      secretKey
    );

    res.send({
      status: "success",
      data: {
        user: {
          id: user.id,
          fullName: user.fullName,
          email,
          token,
          bookOwned: user.bookOwned,
          role: user.role,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Server Error",
    });
  }
};
