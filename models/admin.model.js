const { model, Schema } = require("mongoose");


const adminSchema = new Schema(
    {
      username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        immutable:true
      },
      password: {
        type: String,
        required: true,
      }

    });

module.exports = model("Admin", adminSchema);