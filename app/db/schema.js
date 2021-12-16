const { Schema } = require("mongoose");

const user = new Schema(
  {
    EmailID: {
      required: true,
      type: String,
    },
    UserName: {
      required: true,
      type: String,
    },
    Password: {
      required: true,
      type: String,
    },
    ProfilePic: {
      required: true,
      type: String,
    },
    ValidEmail: {
      required: true,
      type: Boolean,
      default: false,
    },
    ValidAccount: {
      required: true,
      type: Boolean,
      default: false,
    },
    RecoveryNum: {
      required: true,
      type: Boolean,
      default: false,
    },
    Massege: {
      type: Array,
    }
  },
  { timestamps: true }
);
module.exports = {
  user,
};
