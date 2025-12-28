import { Outlet } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "../components/home/Navbar";
import Back from "../components/Back";

export default function MainLayout() {
  return (
    <div>
      <Navbar />
      <div className="bg-[linear-gradient(46deg,#A9B9F8,#667ACA)] px-[6%] py-10 flex flex-col gap-[10px] w-full">
        <Back />
        <Outlet />
      </div>
      <footer>Main Footer</footer>

      <ToastContainer
        position="top-right"
        autoClose={3000} // tự đóng sau 3 giây
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
}
