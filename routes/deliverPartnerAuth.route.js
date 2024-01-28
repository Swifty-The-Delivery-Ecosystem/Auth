const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/checkDeliveryPartner");
const {deliveryPartnerLogin, updateAvailability} = require("../controllers/deliveryPartner.controller");

router.post("/login", deliveryPartnerLogin );

router.put("/availability_status",checkAuth, updateAvailability);

module.exports = router;