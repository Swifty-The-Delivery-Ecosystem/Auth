const mongoose = require("mongoose");
const MenuItem = require("./menuitem.js");

const MenuSchema = mongoose.Schema({
  items: [
    {
      type: MenuItem.schema,
    },
  ],
  vendor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
  },
});

module.exports = mongoose.model("Menu", MenuSchema);
