import mongoose from "mongoose";

const OTPSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },

    otp: {
      type: String,
      required: true,
    },

    expiredAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
OTPSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0}); 

export default mongoose.model("OTP", OTPSchema);


