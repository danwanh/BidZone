import axios from "../../api/axios";
import { useEffect, useState } from "react";

const Email = ({ user_email, last_name, step, setStep }) => {
  const [sentCode, setSentCode] = useState("");
  const [code, setCode] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const genCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const onVerify = () => {
    console.log(sentCode + "*" + code);
    if (sentCode == code) {
      setStep(3);
      window.scrollTo(0, 600);
    } else {
      alert("Wrong code");
    }
  };

  const sendEmail = async () => {
    try {
      const codeToSend = genCode();
      setSentCode(codeToSend);
      const response = await axios.post("/api/email/becomeSeller", {
        email: user_email,
        lastName: last_name,
        code: codeToSend,
      });

      if (response.data.success) {
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  useEffect(() => {
    if (step === 2) {
      sendEmail();
    }
  }, [step]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Email Verification
      </h2>
      <p className="text-gray-600 text-sm mb-6 text-center">
        Enter the 6-digit code sent to your email address
      </p>

      <div className="flex justify-center gap-3 mb-6">
        {/* Hidden input that captures the typing */}
        <input
          type="text"
          inputMode="numeric"
          maxLength="6"
          value={code}
          onChange={(e) => setCode(e.target.value.toString())}
          className="absolute opacity-0 w-full h-12 cursor-text"
          autoFocus
        />

        {/* Visual squares */}
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className="w-12 h-12 flex items-center justify-center text-2xl Space border-2 border-gray-300 rounded-lg bg-white"
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
        Verify
      </button>

      <p className="text-gray-500 text-sm mt-4">
        Didn't receive the code?{" "}
        <span
          onClick={sendEmail}
          className="text-[#6ADBB9] hover:text-[#39977b] font-semibold cursor-pointer"
        >
          Resend
        </span>
      </p>

      <p className="text-gray-500 text-sm mt-4">
        Wrong email?{" "}
        <span
          onClick={() => setStep(1)}
          className="text-[#6ADBB9] hover:text-[#39977b] font-semibold cursor-pointer"
        >
          Return to step 1
        </span>
      </p>
    </div>
  );
};

export default Email;
