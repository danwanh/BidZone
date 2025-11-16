import { Outlet } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MainLayout() {
  return (
    <div>
      <header>Main Header</header>
      <Outlet />
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
