const { model, Schema } = require("mongoose");

const userCredentialsSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
});

module.exports = model("UserCredentials", userCredentialsSchema);
