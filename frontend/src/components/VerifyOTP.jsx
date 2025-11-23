import { useState, useRef, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { OTPInput } from "otp-input-react";

const VerifyOTP = ({ data, toRecaptcha }) => {
  const length = 6;
  const [otp, setOtp] = useState();

  useEffect(() => {
    // focus vào ô đầu tiên khi component mount
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    const code = otp.join("");
    if (code.length < 6 || code.includes("")) {
      toast.error("Vui lòng nhập đủ mã OTP");
      return;
    }

    try {
      await api.post("/api/otp/verify", {
        email: data.email,
        otp: code,
      });
      toast.success("Đã gửi OTP");
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
              {" "}
              Xác thực OTP
            </h1>
            <p>Vui lòng nhập mã OTP đã được gửi tới email của bạn</p>
          </div>

          <form className="max-w-xs mx-auto p-4 space-y-7" onSubmit={onSubmit}>
            <div className="flex gap-3">
              <OTPInput
                value={otp}
                onChange={setOtp}
                autoFocus
                OTPLength={6}
                otpType="number"
                disabled={false}
                secure
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
