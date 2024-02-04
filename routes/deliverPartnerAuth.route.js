const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/checkDeliveryPartner");
const {
  deliveryPartnerLogin,
  updateAvailability,
  getDeliveryPartner,
} = require("../controllers/deliveryPartner.controller");

router.post("/login", deliveryPartnerLogin);

router.put("/availability_status", checkAuth, updateAvailability);
router.get("/get_delivery_boy/:delivery_boy_id", getDeliveryPartner);

module.exports = router;
