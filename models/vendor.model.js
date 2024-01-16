const { model, Schema } = require("mongoose");

const vendorSchema = new Schema(
  {
    ownerName: {
      type: String,
      required: true,
      trim: true
    },
    restaurantName: {
      type: String,
      required: true,
      trim: true
    },
    restaurantId: {
      type: Number,
      unique: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: Number,
      required: true // Index according to the list [Mess, GH, Acad, Delta]
    },
    openingHours: {
      type: String // 9 am to 8 pm
    },
    isActive: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      enum: ['active', 'in process', 'debarred','closed'],
      default: 'in process',
    },
    ratings: {
      type: Number
    },
    images: [String],
    tags:[String],
  },
  { timestamps: true }
);

module.exports = model("Vendor", vendorSchema);
