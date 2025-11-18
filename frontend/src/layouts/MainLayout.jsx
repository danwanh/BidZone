import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div>
      <header>Main Header</header>
      <div className="bg-[linear-gradient(46deg,#A9B9F8,#667ACA)] px-[6%] py-20 flex gap-[30px] w-full">
        <Outlet />
      </div>
      <footer>Main Footer</footer>
    </div>
  );
}
