const express = require("express");
const router = express.Router();


const checkAuth = require("../middlewares/checkAuth");
const checkAdmin = require("../middlewares/checkAdmin");
const {
  fetchCurrentUser,
  loginWithPhoneOtp,
  createNewUser,
  verifyPhoneOtp,
  handleAdmin
} = require("../controllers/userAuth.controller");


router.post("/register", createNewUser);

router.post("/login", loginWithPhoneOtp);

router.post("/verify", verifyPhoneOtp);

router.get("/currentUser", checkAuth, fetchCurrentUser);

router.get("/admin", checkAuth, checkAdmin, handleAdmin);

module.exports = router;
