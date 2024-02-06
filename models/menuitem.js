const { json } = require("express");
const mongoose = require("mongoose");

// TODO : Apply check on rating cant be changed by restaurant

const MenuItemSchema = mongoose.Schema({
  item_id: {
    type: String,
  },
  name: {
    type: String,
  },
  is_veg: {
    type: Boolean,
  },
  image_url: {
    type: String,
  },
  price: {
    type: Number,
  },
  description: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  vendor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
  },
  rating: {
    type: Number,
  },
  number_of_ratings: {
    type: Number,
  },
  tags: {
    type: [String],
  },
  category: {
    type: String,
  },
  is_available: {
    type: Boolean,
    default: true,
  },
  nutritional_values: {
    type: String,
  },
  is_healthy: {
    type: Boolean,
  },
  on_offer: {
    type: Boolean,
  },
  offer_price: {
    type: Number,
  },
});

module.exports = mongoose.model("MenuItem", MenuItemSchema);
