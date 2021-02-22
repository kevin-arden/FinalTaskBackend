const jwt = require("jsonwebtoken");
const { User } = require("../../models");

exports.authenticated = (req, res, next) => {
  let header, token;

  if (
    !(header = req.header("Authorization")) ||
    !(token = header.replace("Bearer ", ""))
  )
    return res.status(400).send({
      message: "Access Denied",
    });

  try {
    const secretKey = "secret-key";
    const verified = jwt.verify(token, secretKey);

    req.user = verified;

    next();
  } catch (err) {
    return res.status(400).send({
      message: "Invalid Token",
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  const verifiedUser = req.user;

  try {
    if (!verifiedUser) {
      return res.status(400).send({
        message: "Token not found, Auth Denied",
        
      });
    }
    
    const admin = await User.findOne({ where: { id: verifiedUser.id } });
    console.log(admin)
    if (!admin) {
      return res.status(400).send({ message: "Admin not found" });
    }

    if (admin.role !== "ADMIN") {
      return res.status(400).send({
        message: "You are not admin",
      });
    }

    next();
  } catch (err) {
    res.status(500).send({
      message: "Server Error",
    });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
    });

    res.send({
      message: "User Valid",
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