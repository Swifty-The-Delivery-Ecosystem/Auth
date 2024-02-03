const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/checkVendor");

const {
  vendorLogin,
  createNewVendor,
  fetchCurrentVendor,
  verifyOtp,
  updateVendorProfile,
  registerDeliveryPartner,
  updateDeliveryPartner,
  deleteDeliveryPartner,
  getDeliveryPartner,
} = require("../controllers/vendorAuth.controller");

router.post("/register", createNewVendor);

router.post("/login", vendorLogin);

router.post("/verify", verifyOtp);

router.get("/:vendor_id", checkAuth, fetchCurrentVendor);

router.put("/:user_id/update", checkAuth, updateVendorProfile);

router.post("/delivery_partner/register", checkAuth, registerDeliveryPartner);

router.get("/delivery_partner/view",checkAuth,getDeliveryPartner);

router.put("/update/delivery_partner_update", checkAuth, updateDeliveryPartner);

router.delete("/delivery_partner/delete", checkAuth, deleteDeliveryPartner);

module.exports = router;