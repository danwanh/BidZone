import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";

const Login = ({ toRegister }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [captcha, setCaptcha] = useState(null);

  const onSubmit = async (data) => {
    if (!captcha) {
      alert("Vui lòng xác nhận CAPTCHA");
      return;
    }
    console.log(JSON.stringify(data, null, 2));
    try {
      const res = await api.post("/api/auth/login", {
        ...data,
        captcha,
      });
      console.log("Tạo tài khoản thành công: ", res.data);
    } catch (err) {
      console.log("Đăng nhập thất bại:" + err.message);
      console.log(err.response.data.message);
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
        </div>
      </div>
    </div>
  );
};

export default Login;
