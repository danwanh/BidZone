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
import { ProfilePage } from "./pages/Profile"

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "", element: <Home /> },
      { path: "/profile", element: <ProfilePage />}
    ],
  },

]);

const App = () => {
  return <RouterProvider router={router}/>;
  
}

export default App;