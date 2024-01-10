const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone:{
      type: Number,
      required:true,
      unque: true
    },
    favourite_vendors: {
      type: [String],  
    },
    primary_location:{
      type: Number,
      // required:true
    },
    otp: {
      code: {
        type: Number,
      },
      expiresAt: {
        type: Date,
      },
    },
    is_Veg: {
      type: Boolean
    },
  },
  
  { timestamps: true }
);

module.exports = model("User", userSchema);
