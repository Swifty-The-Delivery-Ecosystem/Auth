const express = require("express");
const router = express.Router();

const checkAdmin = require("../middlewares/checkAdmin");

const {adminLogin, vendorApplicationStatusView, changeVendorApplicationStatus} = require("../controllers/adminAuth.controller")


router.post("/adminLogin", checkAuth, checkAdmin, adminLogin);
router.get("/viewNewVendors", checkAuth, checkAdmin,vendorApplicationStatusView);
router.put("vendors/:vendorId/status", checkAuth, checkAdmin,changeVendorApplicationStatus )
module.exports = router;