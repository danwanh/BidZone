import { useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import OTPInput from "otp-input-react";

const VerifyOTP = ({ data, toRecaptcha }) => {
  const [otp, setOtp] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Vui lòng nhập đủ mã OTP");
      return;
    }

    try {
      await api.post("/api/otp/verify", {
        email: data.email,
        otp: otp, // đã là string 6 ký tự
      });

      toast.success("Xác thực OTP thành công");
      toRecaptcha();
    } catch (err) {
      toast.error("OTP không đúng hoặc đã hết hạn");
    }
  };

  return (
    <div className="flex w-full h-screen">
      <div className="w-full flex items-center justify-center">
        <div className="bg-white shadow-xl p-7 rounded-md ">
          <div className="flex-row w-full justify-between">
            <h1 className="font-bold text-2xl text-center mb-3">
              Xác thực OTP
            </h1>
            <p>Vui lòng nhập mã OTP đã được gửi tới email của bạn</p>
          </div>

          <form className="max-w-xs mx-auto p-4 space-y-7" onSubmit={onSubmit}>
            <div className="flex justify-center">
              <OTPInput
                value={otp}
                onChange={setOtp}
                autoFocus
                inputClassName="
                  w-12 h-12 border-2 border-black-500 rounded-lg 
                  text-xl text-center 
                  focus:border-blue-600 outline-none"
                OTPLength={6}
                otpType="number"
                disabled={false}
              />
            </div>

            <button
              type="submit"
              className="bg-(--button-fill) text-white w-full rounded-full 
                p-2 font-semibold text-xl cursor-pointer"
            >
              Xác nhận
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
