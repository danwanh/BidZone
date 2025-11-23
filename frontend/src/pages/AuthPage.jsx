import { useState } from "react";
import Register from "../components/Register";
import Login from "../components/Login";
import VerifyOTP from "../components/VerifyOTP";
import Recaptcha from "../components/Recaptcha";

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  //1. register -> 2.otp -> 3.recaptcha
  const [step, setStep] = useState(2);

  const [data, setData] = useState({}); // lưu data để gởi qua OTP

  const toLogin = () => {
    setStep(0);
    setIsLogin(true);
  };

  const toRegister = () => {
    setIsLogin(false);
    setStep(1);
  };

  // Khi đăng ký thành công (đã gửi OTP), lưu data
  const toOTP = (data) => {
    setData(data);
    setStep(2);
  };

  const toRecaptcha = () => {
    setStep(3);
  };

  return (
    <>
      {isLogin && <Login toRegister={toRegister} />}
      {!isLogin && step === 1 && <Register toLogin={toLogin} toOTP={toOTP} />}
      {!isLogin && step === 2 && (
        <VerifyOTP data={data} toRecaptcha={toRecaptcha} />
      )}
      {!isLogin && step === 3 && <Recaptcha data={data} />}
    </>
  );
};
