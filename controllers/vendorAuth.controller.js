const Vendor = require("../models/vendor.model");
const VendorCredentials = require("../models/vendor.credentials");
const OTP = require("../models/otp.model");

const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const {
  USER_NOT_FOUND_ERR,
  INCORRECT_OTP_ERR,
  OTP_EXPIRED_ERR,
  EMAIL_ALREADY_EXISTS_ERR,
} = require("../errors");

const { createJwtToken } = require("../utils/token.util");
const DeliveryPartner = require("../models/deliveryPartner.model");
const menuModel = require("../models/menu.model");

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  user: "adityavinay@iitbhilai.ac.in",
  pass: "mxzc acbf revb xcxh",
});

// --------------------- create new user ---------------------------------

exports.createNewVendor = async (req, res, next) => {
  try {
    let {
      email,
      ownerName,
      restaurantName,
      password,
      location,
      phone,
      supported_location,
      isActive,
      image_url,
      tags
    } = req.body;

    let images = [image_url];

    const emailExist = await Vendor.findOne({ email });
    if (emailExist) {
      next({ status: 400, message: EMAIL_ALREADY_EXISTS_ERR });
      return;
    }

    const createVendor = new Vendor({
      ownerName,
      email,
      restaurantName,
      location,
      supported_location,
      phone,
      isActive,
      images,
      tags
    });
    const vendor = await createVendor.save();

    const createVendorCredentials = new VendorCredentials({
      email,
      password,
      vendor_id: vendor._id,
    });
    await createVendorCredentials.save();

    const menu = new menuModel({
      vendor_id: vendor._id,
      items: [],
    });
    await menu.save();

    const otp = Math.floor(1000 + Math.random() * 9000);
    const sentOtp = new OTP({
      code: otp,
      expiresAt: new Date(new Date().getTime() + 2 * 60 * 1000),
      entity: vendor._id,
      entityModel: "Vendor",
    });
    await sentOtp.save();

    let mailDetails = {
      from: "adityavinay@iitbhilai.ac.in",
      to: email,
      subject: "Test mail",
      text: `Your OTP is: ${otp}`,
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        console.log("Error Occurs");
        console.log(err);
      } else {
        console.log("Email sent successfully");
      }
    });

    res.status(200).json("OTP send successfully");
  } catch (error) {
    next(error);
  }
};

// ------------ login with password ----------------------------------

exports.vendorLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const vendor = await VendorCredentials.findOne({ email });

    if (!vendor) {
      next({ status: 400, message: USER_NOT_FOUND_ERR });
      return;
    }

    const passwordMatch = vendor.password === password;
    if (passwordMatch) {
      // Generate JWT token
      const token = createJwtToken({ userId: vendor.vendor_id });

      res.status(201).json({
        type: "success",
        data: {
          token,
          userId: vendor._id,
        },
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    next(error);
  }
};

// ---------------------- verify mail otp -------------------------

exports.verifyOtp = async (req, res, next) => {
  try {
    const { in_otp, email } = req.body;
    console.log(req.body);
    const vendor = await Vendor.findOne({ email });
    const currentDateTime = new Date();
    if (!vendor) {
      next({ status: 400, message: USER_NOT_FOUND_ERR });
      return;
    }

    const otp = await OTP.findOneAndUpdate({ entity: vendor._id },
      {
      status: "active",
    })
      .sort({ createdAt: -1 }) // Sort in descending order based on timestamp
      .limit(1);

    if (in_otp !== otp.code) {
      next({ status: 400, message: INCORRECT_OTP_ERR });
      return;
    }
    if (otp.expiresAt < currentDateTime) {
      next({ status: 400, message: OTP_EXPIRED_ERR });
      return;
    }

    const token = createJwtToken({ userId: vendor._id });

    // vendor.otp = null;
    vendor.save();
    res.status(201).json({
      type: "success",
      message: "OTP verified successfully.",
      data: {
        token,
        userId: vendor._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

// --------------- fetch current user -------------------------

exports.fetchCurrentVendor = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;

    return res.status(200).json({
      type: "success",
      message: "fetch current user",
      data: {
        user: currentUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

// --------------- Update vendor profile -------------------------

exports.updateVendorProfile = async (req, res, next) => {
  try {
    const currentVendor = res.locals.user;
    const vendor = await Vendor.findById(currentVendor.userId);
    for (const [key, value] of Object.entries(req.body)) {
      if (key !== "email") {
        vendor[key] = value;
      }
    }
    const updatedVendor = await vendor.save();

    return res.status(200).json({
      type: "success",
      message: "updated profile",
      data: {
        user: updatedVendor,
      },
    });
  } catch (error) {
    next(error);
  }
};

// --------------- Register Delivery Partner -------------------------

exports.registerDeliveryPartner = async (req, res, next) => {
  try {
    const currentVendor = res.locals.user;

    const {name, phone} = req.body;   

    const otp = Math.floor(1000 + Math.random() * 9000);
    const deliveryPartner = new DeliveryPartner({
      name: name,
      phone: phone,
      otp: otp,
      vendor_id: currentVendor,
    });
    await deliveryPartner.save();

    
    res.status(201).json({data: {
      deliveryPartner: deliveryPartner,
    }});


    res.status(201).json({ deliveryPartner, otp });
  } catch (error) {
    next(error);
  }
};

// --------------- GET Delivery Partner -------------------------

exports.getDeliveryPartner = async (req, res, next) => {
  try {
    const currentVendor = res.locals.user;
    const deliveryPartners = await DeliveryPartner.find({
      vendor_id: currentVendor,
    });

    res.status(201).json({ deliveryPartners });
  } catch (error) {
    next(error);
  }
};

// --------------- UPDATE Delivery Partner -------------------------

exports.updateDeliveryPartner = async (req, res, next) => {
  try {
    const { deliveryPartner_id, name } = req.body;
    const updateDeliveryPartner = await DeliveryPartner.findOneAndUpdate(
      { _id: deliveryPartner_id },
      { $set: { name: name } },
      { new: true }
    );

    res.status(201).json({updateDeliveryPartner});


  } catch (error) {
    next(error);
  }
};

// --------------- DELETE Delivery Partner -------------------------

exports.deleteDeliveryPartner = async (req, res, next) => {
  try {
    const { deliveryPartner_id } = req.body;
    await DeliveryPartner.deleteOne({ _id: deliveryPartner_id });

    res.status(200).json("Deleted successfully");
  } catch (error) {
    next(error);
  }
};
