import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    console.log("triggered");
    if (token) {
      localStorage.setItem("accessToken", token);
      setTimeout(() => {
        navigate("/", { replace: true }); // Redirect to homepage
        console.log("Home");
      }, 3000);
    } else {
      navigate("/auth"); // Redirect to register if no token is found
      console.log("not homw");
    }
  }, []);

  return (
    <div className="flex items-center w-full justify-center bg-gray-100">
      <div className="text-center p-6 bg-white shadow-lg rounded-md w-full">
        <h1 className="text-2xl font-bold mb-4">Đăng nhập thành công!</h1>
        <p className="text-lg">Chuyển tiếp đến trang chủ...</p>
      </div>
    </div>
  );
};
