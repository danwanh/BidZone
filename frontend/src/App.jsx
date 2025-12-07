// import './App.css'

// function App() {

//   return (
//     <>
//        <h1 className="text-3xl text-blue-200 font-bold underline">
//         Hello world!
//       </h1>
//     </>
//   )
// }

// export default App

import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layout
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

// Pages
import { Home } from "./pages/Home";
import { ProfilePage } from "./pages/Profile";
import { AuthPage } from "./pages/AuthPage";
import { AuthSuccess } from "./components/auth/AuthSuccess";
import { AuthFailed } from "./components/auth/AuthFailed.jsx";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { BecomeSellerPage } from "./pages/BecomeSeller.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "", element: <Home /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/becomeseller", element: <BecomeSellerPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "auth", element: <AuthPage /> },
      { path: "products/:id", element: <ProductDetailPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "", element: <AuthPage /> },
      { path: "social-success", element: <AuthSuccess /> },
      { path: "social-failed", element: <AuthFailed /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
