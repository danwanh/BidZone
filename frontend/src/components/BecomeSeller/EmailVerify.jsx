import axios from "../../api/axios";
import { useEffect, useState } from "react";

const Email = ({ user_email, setStep, sendEmail, isSending }) => {
  const [code, setCode] = useState("");
  const onVerify = async () => {
    try {
      const res = await axios.post("/api/otp/verify", {
        email: user_email,
        otp: code,
      });

      if (res.data.message === "OTP verified") {
        setStep(3);
        window.scrollTo(0, 600);
      } else {
        alert("Wrong OTP");
      }
    } catch (error) {
      alert("Wrong or expired OTP");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Xác thực email</h2>

      <p className="text-gray-600 text-sm mb-6 text-center">
        Vui lòng nhập mã 6 ký tự mà hệ thống mới gửi tến email của bạn
      </p>

      <div className="flex justify-center gap-3 mb-6">
        <input
          type="text"
          inputMode="numeric"
          maxLength="6"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="absolute opacity-0 w-full h-12 cursor-text"
          autoFocus
        />

        <div className="flex gap-2">
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className="w-12 h-12 flex items-center justify-center text-2xl border-2 border-gray-300 rounded-lg bg-white"
            >
              {code[idx] || ""}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onVerify}
        className="w-full bg-[#6ADBB9] text-white py-3 rounded-lg font-semibold hover:bg-[#39977b] transition-colors cursor-pointer"
      >
        Xác thực
      </button>

      <p className="text-gray-500 text-sm mt-4">
        Không nhận được mã xác thực?{" "}
        <span
          onClick={sendEmail}
          className={`text-[#6ADBB9] hover:text-[#39977b] font-semibold cursor-pointer ${
            isSending && "opacity-50 cursor-not-allowed"
          }`}
        >
          {isSending ? "Sending..." : "Resend"}
        </span>
      </p>

      <p className="text-gray-500 text-sm mt-4">
        Sai email?
        <span
          onClick={() => setStep(1)}
          className="text-[#6ADBB9] hover:text-[#39977b] font-semibold cursor-pointer"
        >
          Trở về bước 1
        </span>
      </p>
    </div>
  );
};

export default Email;
