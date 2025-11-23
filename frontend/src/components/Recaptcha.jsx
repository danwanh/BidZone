import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import api from "../api/axios";
import { toast } from "react-toastify";

const Recaptcha = ({ data }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCaptcha = async (captchaToken) => {
    setToken(captchaToken);

    try {
      setLoading(true);

      // GỌI API ĐĂNG KÝ sau khi recaptcha hợp lệ
      await api.post("/api/auth/register", {
        ...data,
        recaptcha: token,
      });

      toast.success("Đăng ký thành công!");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Lỗi khi xác thực hoặc đăng ký"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex w-full h-screen">
        <div className="w-full flex items-center justify-center">
          <h1>Vui lòng xác thực ReCaptcha để tiếp tục</h1>
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={handleCaptcha}
          />
          {loading && <p>Đang xử lý...</p>}
        </div>
      </div>
    </>
  );
};

export default Recaptcha;
