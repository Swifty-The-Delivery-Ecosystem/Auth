const User = require("../../models/user.model");
const UserCredentials = require("../../models/user.credentials");
const OTP = require("../../models/otp.model");
const { createJwtToken } = require("../../utils/token.util");
const {
  USER_NOT_FOUND_ERR,
  MAIL_ALREADY_EXISTS_ERR,
  INCORRECT_OTP_ERR,
  INCORRECT_CRED_ERR,
  ACCESS_DENIED_ERR,
  EMAIL_NOT_FOUND_ERR,
  OTP_EXPIRED_ERR
} = require("../../errors");

// ---------------------- verify mail otp -------------------------

exports.verifyOtp = async (req, res, next) => {
  try {
    const { in_otp, email } = req.body;
    const currentDateTime = new Date();

    const user = await User.findOne({ email });
    if (!user) {
      next({ status: 400, message: USER_NOT_FOUND_ERR });
      return;
    }
    const otp = await OTP.findOne({ entity: user._id })
    .sort({ createdAt: -1 }) 
    .limit(1);

    if (in_otp !== otp.code) {
      next({ status: 400, message: INCORRECT_OTP_ERR });
      return;
    }
    if (otp.expiresAt < currentDateTime) {
      next({ status: 400, message: OTP_EXPIRED_ERR});
      return;
    }


    const token = createJwtToken({ userId: user._id });

    res.status(201).json({
      type: "success",
      message: "OTP verified successfully.",
      data: {
        token,
        userId: user._id,
      },
    });
  } catch (error) {
    next(error);
  }
};


exports.createNewUser = async (req, res, next) => {
  try {
    let { email, name, password, phone, primary_location, is_veg } = req.body; // send the hashed passwd from the client

    const emailExist = await User.findOne({ email });

    if (emailExist) {
      next({ status: 400, message: MAIL_ALREADY_EXISTS_ERR });
      return;
    }
    
    
    const createUser = new User({
      name,
      phone,
      email,
      primary_location,
      is_veg,
    });
    // save user
    const user = await createUser.save();

    const createUserCredentials = new UserCredentials({
      user_id:user._id,
      email,
      password
    });

    createUserCredentials.save();

    const otp = Math.floor(1000 + Math.random() * 8000);

    const sentOtp = new OTP({
      code: otp,
      expiresAt: new Date(new Date().getTime() + 2 * 60 * 1000), 
      entity: user._id,   
      entityModel: 'User', 
    });
    await sentOtp.save();

    res.status(200).json({otp: otp});
  } catch (error) {
    next(error);
  }
};

// ------------ login ----------------------------------

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserCredentials.findOne({ email });

    if (!user) {
      next({ status: 400, message: EMAIL_NOT_FOUND_ERR });
      return;
    }

    const passwordMatch = password === user.password ? 1 : 0;

    if (passwordMatch) {
      const token = createJwtToken({ userId: user.user_id });

      res.status(201).json({
        type: "success",
        data: {
          token,
          userId: user._id,
        },
      });
    } else {
      res.status(401).json({ error: INCORRECT_CRED_ERR });
    }
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
        user: currentUser,
      },
    });
  } catch (error) {
    next(error);
  }
};


// --------------- Update vendor profile -------------------------

exports.updateUserProfile = async(req,res,next) => {
  try{
    const currentUser = res.locals.user;
    const user = await User.findById(currentUser._id);
    for (const [key, value] of Object.entries(req.body)) {
      if (key !== 'email') {
        user[key] = value;
      }
    }
    const updatedUser = await user.save();

    return res.status(200).json({
      type: "success",
      message: "updated profile",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
}