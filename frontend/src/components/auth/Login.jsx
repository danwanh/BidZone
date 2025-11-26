import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import api from "../../api/axios";
import { BASE_URL } from "../../api/axios";
import { toast } from "react-toastify";

const Login = ({ toRegister }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const [captcha, setCaptcha] = useState(null);
  const recaptchaRef = useRef(null);

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/api/auth/login", {
        ...data,
        recaptcha: captcha,
      });
      toast.success("Đăng nhập thành công");
      navigate("/");
    } catch (err) {
      toast.error("Đăng nhập thất bại\n" + err.message);
      if (err.response) console.log(err.response.data.message);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset(); // Reset ReCAPTCHA
      }
      setCaptcha(null);
    }
  };

  return (
    <div className="flex w-full h-screen">
      <div className="w-full flex items-center justify-center">
        <div className="bg-white shadow-xl p-7 rounded-md ">
          <div className="flex w-full justify-between">
            <h1 className="font-bold text-2xl"> Đăng Nhập </h1>
            <Link onClick={toRegister} className="underline text-blue-500">
              Đăng ký
            </Link>
          </div>

          <form
            className="max-w-xs mx-auto p-4 space-y-7"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <input
                {...register("email", { required: "Vui lòng nhập email" })}
                id="email"
                type="email"
                placeholder="Email"
                className="w-full rounded-md border p-2 bg-(--input-fill)"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("password", {
                  required: "Vui lòng nhập mật khẩu",
                })}
                id="password"
                type="password"
                placeholder="Mật khẩu"
                className="w-full rounded-md border p-2 bg-(--input-fill)"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={(token) => setCaptcha(token)}
              />
              {!captcha && (
                <p className="text-red-500 text-sm">
                  Vui lòng xác nhận CAPTCHA
                </p>
              )}
            </div>

            <button
              type="submit"
              className="bg-(--button-fill) text-white w-full rounded-full 
                          p-2 font-semibold text-xl cursor-pointer"
            >
              Đăng nhập
            </button>
          </form>
          <h1> Hoặc </h1>
          <br />
          <div className="space-y-4">
            {/* Google */}
            <a
              href={`${BASE_URL}/api/auth/google`}
              className="w-full py-2 bg-red-500 text-white rounded-lg block text-center"
            >
              Đăng nhập bằng Google
            </a>

            {/* Facebook */}
            <a
              href={`${BASE_URL}/api/auth/facebook`}
              className="w-full py-2 bg-blue-600 text-white rounded-lg block text-center"
            >
              Đăng nhập bằng Facebook
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
