import { useLocation, useNavigate } from "react-router-dom";

const Back = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/") {
    return null;
  }

  return (
    <button
      onClick={() => navigate(-1)}
      className="w-fit mb-4 inline-block px-4 py-1 border-2 border-indigo-500 text-indigo-500 rounded-full bg-white hover:bg-indigo-400 hover:border-indigo-400 hover:text-white shadow-xl transition cursor-pointer"
    >
      ← Quay lại
    </button>
  );
};

export default Back;
