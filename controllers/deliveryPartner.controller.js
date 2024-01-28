const DeliveryPartner = require("../models/deliveryPartner.model")
const {
    USER_NOT_FOUND_ERR,
    INCORRECT_CRED_ERR,
    ACCESS_DENIED_ERR,
  } = require("../errors");

exports.deliveryPartnerLogin = async(req,res,next) => {
try{
    const { otp, phone } = req.body;
    const deliveryPartner = await DeliveryPartner.findOne({phone:phone});
    if (!deliveryPartner) {
        next({ status: 400, message: USER_NOT_FOUND_ERR });
        console.log("user not found")
        return;
      }
      if (deliveryPartner.otp !== otp) {
        next({ status: 400, message: INCORRECT_CRED_ERR });
        return;
      }
      const token = createJwtToken({ userId: deliveryPartner._id });

      res.status(201).json({
        type: "success",
        message: "OTP verified successfully.",
        data: {
          token,
          userId: deliveryPartner._id,
        },
      });
}
catch (error) {
    next(error);
}
}

exports.updateAvailability = async(req,res,next) =>{
    try{
        const currentDeliveryPartner = res.locals.user;
        const status = req.body.status;
        const update_availibilty = await DeliveryPartner.findOneAndUpdate(
            { _id: currentDeliveryPartner},
            { $set: { status: status } },
            { new: true });
        if (!update_availibilty) {
        return res.status(404).json({ error: 'Could not update' });
      }
  
      res.status(200);     
    }
    catch(error){
        next(error)
    }
}