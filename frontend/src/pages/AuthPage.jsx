import { useState } from "react";
import Register from "../components/Register";
import Login from "../components/Login";

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const toLogin = () => setIsLogin(true);
  const toRegister = () => setIsLogin(false);

  return (
    <>
      {isLogin && <Login toRegister={toRegister}/>}
      {!isLogin && <Register toLogin={toLogin} />}
    </>
  );
};
