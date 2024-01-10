const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/checkAuth");
const {
  fetchCurrentUser,
  login,
  createNewUser,
  verifyOtp,
  handleAdmin,
  updateUserProfile,
} = require("../controllers/userAuth.controller");

router.post("/register", createNewUser);

router.post("/login", login);

router.post("/verify", verifyOtp);

router.get("/currentUser", checkAuth, fetchCurrentUser);

router.put("/updateUserProfile", checkAuth, updateUserProfile);

module.exports = router;
