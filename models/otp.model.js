const { model, Schema } = require("mongoose");

const otpSchema = new Schema(
  {
    code: {
      type: Number,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    // Reference to User or Vendor
    entity: {
      type: Schema.Types.ObjectId,
      refPath: 'entityModel',
      required: true,
    },
    // Model type for the reference
    entityModel: {
      type: String,
      required: true,
      enum: ['User', 'Vendor'],
    },
  },
  { timestamps: true }
);

const OTP = model("OTP", otpSchema);

module.exports = OTP;
