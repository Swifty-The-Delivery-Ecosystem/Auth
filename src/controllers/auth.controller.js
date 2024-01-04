const User = require("../models/user.model");

const {
  PHONE_NOT_FOUND_ERR,

  PHONE_ALREADY_EXISTS_ERR,
  USER_NOT_FOUND_ERR,
  INCORRECT_OTP_ERR,
  ACCESS_DENIED_ERR,
} = require("../errors");

// const { checkPassword, hashPassword } = require("../utils/password.util");
const { createJwtToken } = require("../utils/token.util");
const {TWILIO_SERVICE_SID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN} = process.env
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
    lazyloading: true
})
// --------------------- create new user ---------------------------------
let countrycode = 91
exports.createNewUser = async (req, res, next) => {
  try {
    let {phone, name} = req.body;
    console.log(req.body)
    
    // check duplicate phone Number
    const phoneExist = await User.findOne({ phone });

    if (phoneExist) {
      next({ status: 400, message: PHONE_ALREADY_EXISTS_ERR });
      return;
    }


    // create new user
    const createUser = new User({
      phone,
      name,
      role : phone === process.env.ADMIN_PHONE ? "ADMIN" :"USER"
    });

    // save user

    const user = await createUser.save();

    const otpResponse = await client.verify
    .services(TWILIO_SERVICE_SID) 
    .verifications.create({
        to:`+${countrycode}${phone}`,
        channel: "sms",
    })

    res.status(200).send(`OTP send successfully : ${JSON.stringify(otpResponse)} `);
  } catch (error) {
    next(error);
  }
};



// ------------ login with phone otp ----------------------------------

exports.loginWithPhoneOtp = async (req, res, next) => {
  try {

    const { phone } = req.body;
    const user = await User.findOne({ phone });

    if (!user) {
      next({ status: 400, message: PHONE_NOT_FOUND_ERR });
      return;
    }

    const otpResponse = await client.verify
    .services(TWILIO_SERVICE_SID) 
    .verifications.create({
        to:`+${countrycode}${phone}`,
        channel: "sms",
    })

    res.status(200).send(`OTP send successfully : ${JSON.stringify(otpResponse)} `);
  
  } catch (error) {
    next(error);
  }
};

// ---------------------- verify phone otp -------------------------
 
exports.verifyPhoneOtp = async (req, res, next) => {
  try {
    const { otp, phone } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      next({ status: 400, message: USER_NOT_FOUND_ERR });
      return;
    }

    const verifiedResponse = await client.verify.
    services(TWILIO_SERVICE_SID)
    .verificationChecks.create({
        to:`+${countrycode}${phone}`,
        code: otp,
    });

    const token = createJwtToken({ userId: user._id });


    res.status(201).json({
      type: "success",
      message: "OTP verified successfully",
      data: {
        token,
        userId: user._id,
      },
    });
  } catch (error) {
    next(error);
  }
};


// --------------- fetch current user -------------------------

exports.fetchCurrentUser = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;


    return res.status(200).json({
      type: "success",
      message: "fetch current user",
      data: {
        user:currentUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

// --------------- admin access only -------------------------

exports.handleAdmin = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;

    return res.status(200).json({
      type: "success",
      message: "Okay you are admin!!",
      data: {
        user:currentUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

