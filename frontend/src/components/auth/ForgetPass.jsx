import React from "react";

const ForgetPass = () => {


  return (
    <div className="flex -mt-25 -mb-15 w-full h-screen">
      <div className="w-full flex items-center justify-center">
        <div className="bg-white shadow-xl p-7 rounded-2xl min-w-[30vw] ">
          <div className="flex w-full justify-between">
            <h1 className="font-bold text-2xl"> Đăng Nhập </h1>
            <Link onClick={toRegister} className="underline text-blue-500">
              Tạo mật khẩu mới cho tài khoản của bạn
            </Link>
          </div>

          <h2 className="font-semibold text-xl">Vui lòng điền email của bạn để được gửi mật khẩu mới</h2>

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
            <button
              type="submit"
              className="bg-(--button-fill) text-white w-full rounded-full 
                          p-3 px-5 font-semibold text-xl cursor-pointer"
            >
              Xác nhận
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPass;
