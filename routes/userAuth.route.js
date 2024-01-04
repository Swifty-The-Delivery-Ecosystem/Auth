const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/checkAuth");
const checkAdmin = require("../middlewares/checkAdmin");
const {
  fetchCurrentUser,
  login,
  createNewUser,
  verifyOtp,
  handleAdmin,
} = require("../controllers/userAuth.controller");

router.post("/register", createNewUser);

router.post("/login", login);

router.post("/verify", verifyOtp);

router.get("/currentUser", checkAuth, fetchCurrentUser);

router.get("/admin", checkAuth, checkAdmin, handleAdmin);

module.exports = router;
