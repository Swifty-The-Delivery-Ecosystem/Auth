const { model, Schema } = require("mongoose");

const vendorCredentialsSchema = new Schema({
    vendorId: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true,
        unique: true,
      },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    immutable: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = model("Credentials", vendorCredentialsSchema);
