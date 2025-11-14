import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div>
      <header>Main Header</header>
      <Outlet />
      <footer>Main Footer</footer>
    </div>
  );
}
