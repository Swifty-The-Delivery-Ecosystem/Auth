const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/checkVendor");

const {
  vendorLogin,
  createNewVendor,
  fetchCurrentVendor,
  verifyOtp,
  updateVendorProfile,
  resgisterDeliveryPartner,
} = require("../controllers/vendorAuth.controller");

router.post("/register", createNewVendor);

router.post("/login", vendorLogin);

router.post("/verify", verifyOtp);

router.get("/:vendor_id", checkAuth, fetchCurrentVendor);

router.put("/:user_id/update", checkAuth, updateVendorProfile);

router.post("/delivery_partner/register", checkAuth, resgisterDeliveryPartner);

module.exports = router;