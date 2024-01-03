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
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    otp: {
      code: {
        type: Number,
      },
      expiresAt: {
        type: Date,
      },
    },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
