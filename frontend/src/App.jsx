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

// Pages
import { Home } from "./pages/Home";
import { ProfilePage } from "./pages/Profile";
import { BecomeSellerPage } from "./pages/BecomeSeller";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "", element: <Home /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/becomeseller", element: <BecomeSellerPage /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
