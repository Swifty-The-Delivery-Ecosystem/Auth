const Admin = require("../models/admin.model");
const Vendor = require("../models/vendor.model")
const User = require("../models/user.model")
const { createJwtToken } = require("../utils/token.util");
const {
    
    ADMIN_NOT_FOUND_ERR,
    ACCESS_DENIED_ERR,
    
  } = require("../errors");

  // --------------- admin login -------------------------

  exports.adminLogin = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const admin = await Admin.findOne({ username });
  
      if (!admin) {
        next({ status: 400, message: ADMIN_NOT_FOUND_ERR });
        return;
      }
      
      const passwordMatch = admin.password=== password;
      if (passwordMatch) {
          // Generate JWT token
          const token = createJwtToken({ userId: admin._id });
  
          res.status(201).json({
              type: "success",
              data: {
                token,
                userId: admin._id,
              },
            });
  
      } else {
          res.status(401).json({ error: 'Invalid credentials' });
      }
      
    } catch (error) {
      next(error);
    }
  };
  
 // --------------- Get Restaurant application status ------------------------


 exports.vendorApplicationStatusView = async (req, res, next) => {
    try {

      const newVendors = await Vendor.find({ status: 'in process' }).select('_id restaurantName ownerName location phone');
        res.status(201).json({
            type: "success",
            data: {
              newVendors
            },
          });
    
    } catch (error) {
      next(error);
    }
  };
  
 // --------------- Change Restaurant application status ------------------------

 exports.changeVendorApplicationStatus = async (req, res, next) => {
    const { vendorId } = req.params;
    const { newStatus } = req.body;
  
    try {
     
      const updatedVendor = await Vendor.findOneAndUpdate(
        { _id: vendorId },
        { $set: { status: newStatus } },
        { new: true } 
      );
  
      if (!updatedVendor) {
        return res.status(404).json({ error: 'Vendor not found' });
      }
  
      res.status(200).json(updatedVendor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

 // --------------- Debar Vendor ------------------------

 exports.debarVendor = async (req, res, next) => {
  const { vendorId } = req.body;
  try {
    const debarVendor = await Vendor.findOneAndUpdate(
      { _id: vendorId },
      { $set: { status: 'debarred' } },
      { new: true } 
    );

    if (!debarVendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    res.status(200).json("Vendor debarred successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// --------------- GET all Users ------------------------

exports.getAllUsers = async (req, res, next) => {

  try {
    const users = await User.find({});
    if (!users) {
      return res.status(404).json({ error: 'users not found' });
    }

    res.status(200).json({
      users:users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

 // --------------- Debar User ------------------------

 exports.debarUser = async (req, res, next) => {
  const { userId } = req.body;

  try {
    const debaruser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { status: 'debarred' } },
      { new: true } 
    );

    if (!debaruser) {
      return res.status(404).json({ error: 'user not found' });
    }

    res.status(200).json("users debarred successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};