const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/checkVendor");

const {
  vendorLogin,
  createNewVendor,
  fetchCurrentVendor,
  verifyOtp,
  updateVendorProfile,
} = require("../controllers/vendorAuth.controller");

router.post("/register", createNewVendor);

router.post("/login", vendorLogin);

router.post("/verify", verifyOtp);

router.get("/currentVendor", checkAuth, fetchCurrentVendor);

router.put("/updateVendorProfile", checkAuth, updateVendorProfile);

module.exports = router;
