const { model, Schema } = require("mongoose");

const menuItemSchema = new Schema({
  itemName: String,
  description: String,
  price: Number,
  category: Number, //[Veg, Non-Veg]
});

const ratingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number, required: true },
  comment: String,
});

const vendorSchema = new Schema(
  {
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    restaurantName: {
      type: String,
      required: true,
      trim: true,
    },
    restaurantId: {
      type: Number,
      //required: false,
      unique: true,
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
    phone: {
      type: String,
      // required: true,
      trim: true,
    },
    address: {
      street: Number, // Index according to the list [Mess, GH, Acad, Delta]
    },
    // cuisineType: {
    //   type: Number, //Index according to the list [Drinks, Food Items]
    //   required: true,
    // },
    menu: [menuItemSchema],
    openingHours: {
      type: String, //9 am to 8 pm
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    ratings: [ratingSchema],
    images: [String],
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

module.exports = model("Vendor", vendorSchema);
