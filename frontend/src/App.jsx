// import './App.css'

import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layout
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

// Pages
import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./pages/Profile";
import { AuthPage } from "./pages/AuthPage";
import { AuthSuccess } from "./components/auth/AuthSuccess";
import { AuthFailed } from "./components/auth/AuthFailed.jsx";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { BecomeSellerPage } from "./pages/BecomeSeller.jsx";
import ProductList from "./components/home/ProductList.jsx";
import { Admin } from "./pages/AdminPage.jsx";
import UploadProductPage from "./pages/UploadProductPage.jsx";
import { AllProducts } from "./pages/AllProducts.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/becomeseller", element: <BecomeSellerPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "auth", element: <AuthPage /> },
      { path: "products", element: <AllProducts/>},
      { path: "products/:id", element: <ProductDetailPage /> },
      { path: "/products/new", element: <UploadProductPage /> },
      { path: "*", element: <NotFoundPage /> },
      { path: "/admin", element: <Admin /> },
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
