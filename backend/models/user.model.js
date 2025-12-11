import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["bidder", "seller", "admin"],
      default: "bidder",
      required: [true, "Please enter role"],
    },

    name: {
      type: String,
      required: [true, "Please enter name"],
      unique: true,
    },

    email: {
      type: String,
      required: false,
      unique: true,
    },

    phone: {
      type: String,
    },

    password_hash: {
      type: String,
    },

    address: {
      type: String,
    },

    dob: {
      type: Date,
    },

    rating_pos: {
      type: Number,
    },

    rating_neg: {
      type: Number,
    },

    is_verified: {
      type: Boolean,
    },

    otp_expires: {
      type: Boolean,
    },

    reset_password_token: {
      type: String,
    },

    reset_password_expires: {
      type: Boolean,
    },

    social_is: {
      type: String,
    },

    oauth: {
      google: {
        id: String,
        raw: Object,
      },
      facebook: {
        id: String,
        raw: Object,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
