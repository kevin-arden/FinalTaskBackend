const express = require("express");
const router = express.Router();
const { authenticated, isAdmin, checkAuth } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/upload");

//books
const {
  getBooks,
  getDetailBook,
  addBook,
  downloadBook,
  getPromoBooks,
} = require("../controllers/book");

//users
const { getUsers, getSingleUser, editUser } = require("../controllers/user");

//login
const { login } = require("../controllers/login");

//register
const { register } = require("../controllers/register");

//transaction
const {
  getAllTransactions,
  getTransaction,
  addTransactions,
  editTransaction,
} = require("../controllers/transaction");

//route books
router.get("/books", getBooks);
router.get("/book/:id", getDetailBook);
router.post("/book", uploadFile("attachment", "bookAttachment"), addBook);
router.get("/pdf/:id", downloadBook);
router.get("/promo", getPromoBooks);

//route users
router.get("/users", getUsers);
router.patch("/user", authenticated, editUser);
router.get("/profile", authenticated, getSingleUser);

//login-register
router.post("/login", login);
router.post("/register", register);

//transaction
router.get("/transactions", getAllTransactions);
router.get("/transaction/:id", getTransaction);
router.post(
  "/transaction",
  authenticated,
  uploadFile("attachment"),
  addTransactions
);
router.patch("/transaction/:id", editTransaction);

module.exports = router;
