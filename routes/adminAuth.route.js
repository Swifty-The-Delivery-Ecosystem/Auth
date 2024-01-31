const express = require("express");
const router = express.Router();

const checkAdmin = require("../middlewares/checkAdmin");
const checkAuth = require("../middlewares/checkAuth");
const {
  adminLogin,
  vendorApplicationStatusView,
  changeVendorApplicationStatus,
  debarVendor,
  debarUser,
  getAllUsers,
  getAllVendors,
} = require("../controllers/adminAuth.controller");

router.post("/login", adminLogin);
router.get("/new_vendors", checkAdmin, vendorApplicationStatusView);
router.put(
  "/vendors/:vendorId/status",
  checkAdmin,
  changeVendorApplicationStatus
);
router.put("/vendor", checkAdmin, debarVendor);
router.put("/user", checkAdmin, debarUser);
router.get("/users/view", checkAdmin, getAllUsers);
router.get("/vendors/view", checkAdmin, getAllVendors);

module.exports = router;
