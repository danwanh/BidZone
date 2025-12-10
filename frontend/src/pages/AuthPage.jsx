import { useState } from "react";
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";
import VerifyOTP from "../components/auth/VerifyOTP";
import Recaptcha from "../components/auth/Recaptcha";

const STEP = {
  LOGIN: 0,
  REGISTER: 1,
  OTP: 2,
  RECAPTCHA: 3,
  FORGETPASS: 4
};

export const AuthPage = ({page}) => {
  const [isLogin, setIsLogin] = useState(false);
  //1. register -> 2.otp -> 3.recaptcha
  const [step, setStep] = useState(STEP.REGISTER);
  if (page) setStep(STEP);

  const [data, setData] = useState({}); // lưu data để gởi qua OTP

  const toLogin = () => {
    setStep(STEP.LOGIN);
    setIsLogin(true);
  };

  const toRegister = () => {
    setIsLogin(false);
    setStep(STEP.REGISTER);
  };

  // Khi đăng ký thành công (đã gửi OTP), lưu data
  const toOTP = (data) => {
    setData(data);
    setStep(STEP.OTP);
  };

  const toRecaptcha = () => {
    setStep(STEP.RECAPTCHA);
  };

  const toHomePage = () => {};

  return (
    <>
      {isLogin && <Login toRegister={toRegister} />}
      {!isLogin && step === 1 && <Register toLogin={toLogin} toOTP={toOTP} />}
      {!isLogin && step === 2 && (
        <VerifyOTP data={data} toRecaptcha={toRecaptcha} />
      )}
      {!isLogin && step === 3 && <Recaptcha data={data} toLogin={toLogin} />}
    </>
  );
};
