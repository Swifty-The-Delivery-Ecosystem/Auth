const express = require("express");
const router = express.Router();

const checkAdmin = require("../middlewares/checkAdmin");
const checkAuth = require("../middlewares/checkAuth");
const {adminLogin, vendorApplicationStatusView, changeVendorApplicationStatus} = require("../controllers/adminAuth.controller")


router.post("/login", adminLogin);
router.get("/viewNewVendors",  checkAdmin,vendorApplicationStatusView);
router.put("vendors/:vendorId/status", checkAdmin,changeVendorApplicationStatus );

module.exports = router;