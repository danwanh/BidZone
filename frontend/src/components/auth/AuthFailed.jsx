import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthFailed = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const error = url.searchParams.get("error");

    if (error) {
      console.error("OAuth Error:", error); // Log the error for debugging
    }

    setTimeout(() => {
      navigate("/auth"); // Redirect after a delay or on button click
    }, 5000); 
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-red-100">
      <div className="text-center p-6 bg-white shadow-lg rounded-md w-1/3">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Đăng nhập thất bại</h1>
        <p className="text-lg mb-4">Đã xảy ra lỗi trong quá trình đăng nhập, xin vui lòng thử lại.</p>
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
          onClick={() => navigate("/auth")}
        >
          Đăng ký / Đăng nhập
        </button>
      </div>
    </div>
  );
};
