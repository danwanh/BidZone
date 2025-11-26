import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");

    if (token) {
      localStorage.setItem("accessToken", token);
      navigate("/"); // Redirect to homepage or dashboard
    } else {
      navigate("/login"); // Redirect to login if no token is found
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center p-6 bg-white shadow-lg rounded-md w-1/3">
        <h1 className="text-2xl font-bold mb-4">Login Successful!</h1>
        <p className="text-lg">Redirecting you to the homepage...</p>
      </div>
    </div>
  );
};