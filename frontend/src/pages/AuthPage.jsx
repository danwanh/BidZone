import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";
import VerifyOTP from "../components/auth/VerifyOTP";
import Recaptcha from "../components/auth/Recaptcha";
import ForgetPass from "../components/auth/ForgetPass";

const STEP = {
  LOGIN: 0,
  REGISTER: 1,
  OTP: 2,
  RECAPTCHA: 3,
  FORGETPASS: 4
};

export const AuthPage = () => {
  //1. register -> 2.otp -> 3.recaptcha
  const [step, setStep] = useState(STEP.REGISTER);

  const { state } = useLocation();
  const page = state?.page;
  useEffect(() => {
    if (page && STEP[page] !== undefined) {
      setStep(STEP[page]);
    }
  }, [page]);

  const [data, setData] = useState({}); // lưu data để gởi qua OTP

  const toLogin = () => {
    setStep(STEP.LOGIN);
  };

  const toRegister = () => {
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

  const toForgetPass = () => {
    setStep(STEP.FORGETPASS);
  };

  const toHomePage = () => {};

  return (
    <>
      {step === 0 && <Login toRegister={toRegister} toForgetPass={toForgetPass} />}
      { step === 1 && <Register toLogin={toLogin} toOTP={toOTP} />}
      {step === 2 && (
        <VerifyOTP data={data} toRecaptcha={toRecaptcha} />
      )}
      { step === 3 && <Recaptcha data={data} toLogin={toLogin} />}
      {step === 4 && <ForgetPass/>}
    </>
  );
};
