const { model, Schema } = require("mongoose");


const adminSchema = new Schema(
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
        immutable:true
      },
      password: {
        type: String,
        required: true,
      },
      phone:{
        type: Number,
        required:true,
        unque: true
      }

    });

module.exports = model("Admin", adminSchema);