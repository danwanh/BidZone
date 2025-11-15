import { Link } from "react-router-dom";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = "6LenmQwsAAAAAPjXvCW8cnMSoK36HCe1j3pY4YuY"

const Login = () => {
  const [captcha, setCaptcha] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!captcha) {
      alert("Vui lòng xác nhận CAPTCHA");
      return;
    }
  };

  return (
    <div className="flex w-full h-screen">
      <div className="w-full flex items-center justify-center">
        <div className="bg-white shadow-xl p-7 rounded-md ">
          <div className="flex w-full justify-between">
            <h1 className="font-bold text-2xl"> Đăng Nhập </h1>
            <Link to={``} className="underline text-blue-500">
              Đăng ký
            </Link>
          </div>

          <form className="max-w-xs mx-auto p-4 space-y-7">

            <input
              name="email"
              id="email"
              type="email"
              placeholder="Email"
              className="w-full rounded-md border p-2 bg-(--input-fill)"
            />

            <input
              name="password"
              id="password"
              type="password"
              placeholder="Mật khẩu"
              className="w-full rounded-md border p-2 bg-(--input-fill)"
            />

            <ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={(token) => setCaptcha(token)}
            />

            <button
              type="submit"
              className="bg-(--button-fill) text-white w-full rounded-full 
                          p-2 font-semibold text-xl cursor-pointer"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
