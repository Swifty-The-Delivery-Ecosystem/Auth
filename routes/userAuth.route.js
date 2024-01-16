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

router.get("/:userId", checkAuth, fetchCurrentUser);

router.put("/:userId/update", checkAuth, updateUserProfile);

module.exports = router;
