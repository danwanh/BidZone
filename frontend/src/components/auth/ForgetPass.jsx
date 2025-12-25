import { useForm } from "react-hook-form";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ForgetPass = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const email = data.email;
    console.log(data);
    try {
      const res = await api.post("/api/auth/reset-password", { email });
      if (res) toast.success("Mật khẩu mới đã được gửi đến email của bạn!");
      await delay(2000);
      navigate("/auth", { state: { page: "LOGIN" } });
    } catch (error) {
      toast.error("Không thể đặt lại mật khẩu");
      console.log(error);
      console.error(error.response.data?.message || error.message);
    }
  };

  return (
    <div className="flex -mt-25 -mb-15 w-full h-screen">
      <div className="w-full flex items-center justify-center">
        <div className="bg-white shadow-xl p-7 rounded-2xl min-w-[30vw] ">
          <div className="flex w-full justify-between">
            <h1 className="font-bold text-2xl text-center">
              {" "}
              Tạo mật khẩu mới cho tài khoản của bạn{" "}
            </h1>
          </div>

          <h2 className="font-semibold mt-2 text-gray-600 text-md">
            Vui lòng điền email của bạn để được gửi mật khẩu mới
          </h2>

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
            <div className="flex flex-col gap-5 items-center">
              <button
                type="submit"
                className="bg-(--button-fill) text-white w-full rounded-full 
                          p-3 px-5 font-semibold text-xl cursor-pointer"
              >
                Xác nhận
              </button>
              <Link
                to="/auth"
                state={{ page: "LOGIN" }}
                className="text-(--button-fill) w-fit rounded-full 
                          p-3 px-5 font-semibold text-xl cursor-pointer hover:brightness-50"
              >
                Trờ về đăng nhập
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPass;
