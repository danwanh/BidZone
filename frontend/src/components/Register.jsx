import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import api from "../api/axios";
import { toast } from "react-toastify";

const Register = ({ toLogin }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [captcha, setCaptcha] = useState(null);

  const pass_confirm = (pass) => {
    return pass === watch("password") || "Mật khẩu nhập lại không khớp";
  };

  const onSubmit = async (data) => {
    if (!captcha) {
      toast.error("Vui lòng xác nhận CAPTCHA");
      return;
    }
    try {
      const res = await api.post("/api/auth/register", {
        ...data,
        captcha,
      });
      toast.success("Tạo tài khoản thành công");
      toLogin();
    } catch (err) {
      toast.error("Đăng ký thất bại\n" + err.message);
      if (err.response.data) console.log(err.response.data.message);
    }
  };

  return (
    <div className="flex w-full h-screen">
      <div className="w-full flex items-center justify-center">
        <div className="bg-white shadow-xl p-7 rounded-md ">
          <div className="flex w-full justify-between">
            <h1 className="font-bold text-2xl"> Đăng Ký </h1>
            <Link onClick={toLogin} className="underline text-blue-500">
              Đăng nhập
            </Link>
          </div>

          <form
            className="max-w-xs mx-auto p-4 space-y-7"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <input
                {...register("name", { required: "Vui lòng nhập họ tên" })}
                id="name"
                type="text"
                placeholder="Họ tên"
                className="w-full rounded-md border p-2 bg-(--input-fill)"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("address", { required: "Vui lòng nhập địa chỉ" })}
                name="address"
                id="address"
                type="text"
                placeholder="Địa chỉ"
                className="w-full rounded-md border p-2 bg-(--input-fill)"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("email", {
                  required: "Vui lòng nhập email",
                  // pattern: {
                  //   value: /^\S+@\S+\.\S+$/,
                  //   message: "Email không hợp lệ",
                  // },
                })}
                name="email"
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
                name="password"
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
              <input
                {...register("confirm_password", {
                  required: "Vui lòng xác nhận mật khẩu",
                  validate: pass_confirm,
                })}
                name="confirm_password"
                id="confirm_password"
                type="password"
                placeholder="Nhập lại mật khẩu"
                className="w-full rounded-md border p-2 bg-(--input-fill)"
              />
              {errors.confirm_password && (
                <p className="text-red-500 text-sm">
                  {errors.confirm_password.message}
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
              Đăng ký
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
