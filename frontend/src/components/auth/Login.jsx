import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import api from "../../api/axios";
import { BASE_URL } from "../../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const Login = ({ toRegister }) => {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const [captcha, setCaptcha] = useState(null);
  const [seePass, setSeePass] = useState(false);
  const recaptchaRef = useRef(null);

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/api/auth/login", {
        ...data,
        recaptcha: captcha,
      });

      await login(res.data.accessToken, res.data.user);
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
    <div className="flex -mt-20 -mb-20 w-full h-screen">
      <div className="w-full flex items-center justify-center">
        <div className="bg-white shadow-xl p-7 rounded-2xl min-w-[30vw] ">
          <div className="flex w-full justify-between">
            <h1 className="font-bold text-2xl"> Đăng Nhập </h1>
            <Link onClick={toRegister} className="underline text-blue-500">
              Đăng ký
            </Link>
          </div>

          <form
            className="mx-auto p-4 space-y-7 items-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <input
                {...register("email", { required: "Vui lòng nhập email" })}
                id="email"
                type="email"
                placeholder="Email"
                className="w-full rounded-md border p-3 px-5 bg-(--input-fill)"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="relative">
              <input
                {...register("password", {
                  required: "Vui lòng nhập mật khẩu",
                })}
                id="password"
                type={seePass ? "text" : "password"}
                placeholder="Mật khẩu"
                className="w-full rounded-md border p-3 px-5 bg-(--input-fill)"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
              {seePass && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10%"
                  height="100%"
                  viewBox="0 0 24 24"
                  className="absolute top-0 right-0 cursor-pointer pr-2 hover:brightness-150"
                  onClick={() => setSeePass(false)}
                >
                  <path
                    fill="#404041"
                    d="M9.75 12a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0"
                  />
                  <path
                    fill="#404041"
                    fillRule="evenodd"
                    d="M2 12c0 1.64.425 2.191 1.275 3.296C4.972 17.5 7.818 20 12 20s7.028-2.5 8.725-4.704C21.575 14.192 22 13.639 22 12c0-1.64-.425-2.191-1.275-3.296C19.028 6.5 16.182 4 12 4S4.972 6.5 3.275 8.704C2.425 9.81 2 10.361 2 12m10-3.75a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5"
                    clipRule="evenodd"
                  />
                </svg>
              )}

              {!seePass && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="9%"
                  height="100%"
                  viewBox="0 0 24 24"
                  className="absolute top-0 right-0 cursor-pointer pr-2 hover:brightness-150"
                  onClick={() => setSeePass(true)}
                >
                  <path
                    fill="#404041"
                    fillRule="evenodd"
                    d="M1.606 6.08a1 1 0 0 1 1.313.526L2 7l.92-.394v-.001l.003.009l.021.045l.094.194c.086.172.219.424.4.729a13.4 13.4 0 0 0 1.67 2.237a12 12 0 0 0 .59.592C7.18 11.8 9.251 13 12 13a8.7 8.7 0 0 0 3.22-.602c1.227-.483 2.254-1.21 3.096-1.998a13 13 0 0 0 2.733-3.725l.027-.058l.005-.011a1 1 0 0 1 1.838.788L22 7l.92.394l-.003.005l-.004.008l-.011.026l-.04.087a14 14 0 0 1-.741 1.348a15.4 15.4 0 0 1-1.711 2.256l.797.797a1 1 0 0 1-1.414 1.415l-.84-.84a12 12 0 0 1-1.897 1.256l.782 1.202a1 1 0 1 1-1.676 1.091l-.986-1.514c-.679.208-1.404.355-2.176.424V16.5a1 1 0 0 1-2 0v-1.544c-.775-.07-1.5-.217-2.177-.425l-.985 1.514a1 1 0 0 1-1.676-1.09l.782-1.203c-.7-.37-1.332-.8-1.897-1.257l-.84.84a1 1 0 0 1-1.414-1.414l.797-.797a15.4 15.4 0 0 1-1.87-2.519a14 14 0 0 1-.591-1.107l-.033-.072l-.01-.021l-.002-.007l-.001-.002v-.001C1.08 7.395 1.08 7.394 2 7l-.919.395a1 1 0 0 1 .525-1.314"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>

            <div className="flex justify-end">
              <Link
                to="/auth"
                state={{ page: "FORGETPASS" }}
                type="button"
                className="text-gray-500 underline hover:text-gray-700 text-sm"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <div className="flex justify-center items-center flex-col">
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
                          p-3 px-5 font-semibold text-xl cursor-pointer"
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
              className="w-full p-3 px-5 bg-red-500 text-white rounded-lg block text-center"
            >
              Đăng nhập bằng Google
            </a>

            {/* Facebook */}
            <a
              href={`${BASE_URL}/api/auth/github`}
              className="w-full p-3 px-5 bg-gray-700 text-white rounded-lg block text-center"
            >
              Đăng nhập bằng Github
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
