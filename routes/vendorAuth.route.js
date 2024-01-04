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


router.post("/register", createNewVendor);

router.post("/login", vendorLogin);

router.post("/verify", verifyPhoneOtp);

router.get("/currentVendor", checkAuth, fetchCurrentUser);

module.exports = router;
