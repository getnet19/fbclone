const mongodb = require("mongoose");

const userSchema = new mongodb.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
    },
    lastName: { type: String, required: true, minLength: 4, maxLength: 20 },
    profilePictcher: {
      type: String,
      default: "",
    },
    coverPicture: { type: String, default: "" },
    isAdmin: { type: Boolean, default: false },
    email: {
      type: String,
      required: true,
      unique: true,
      minLength: 10,
      maxLength: 50,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      minLength: 13,
      maxLength: 13,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    followers: { type: Array, default: [] },
    followings: { type: Array, default: [] },
    description:{type:String,max:500},
    currentCity: { type: String, maxLength: 50 },
    from: { type: String ,maxLength:50},
    relationship: { type: Number, enum: [1, 2] },
  },
  { timestamps: true }
);

module.exports = mongodb.model("User", userSchema);
