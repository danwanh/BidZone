import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import NavBar from "./NavBar";
import axios from "../../api/axios";
import Email from "./EmailVerify";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  stateProvince: z.string().min(1, "State/Province is required"),
  zipPostalCode: z.string().min(1, "Zip/Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

const Form = () => {
  const [step, setStep] = useState(1);
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();

  const sendEmail = async () => {
    if (isSending) return;
    setIsSending(true);

    try {
      await axios.post("/api/otp/send", {
        email: user.email,
      });

      console.log("OTP sent");
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setIsSending(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    sendEmail();
    setStep(2);
    window.scrollTo(0, 600);
  };

  const confirm = async () => {
    try {
      const values = getValues();

      const dataToSend = {
        user_id: user._id,
        admin_id: "",
        status: "pending",
        first_name: values.firstName,
        last_name: values.lastName,
        email: user.email,
        phone_number: values.phoneNumber,
        address: values.address,
        city: values.city,
        province: values.stateProvince,
        postal: values.zipPostalCode,
        country: values.country,
      };
      console.log(dataToSend);

      const response = await axios.post("/api/upgrade", dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Form submitted successfully:", response.data);
    } catch (err) {
      if (
        err.response?.data?.message ===
        "You already have a pending upgrade request"
      ) {
        toast.error(
          "You've already sent an update request and it hasn't expired"
        );
      } else {
        toast.error(err.response?.data?.message || err.message);
        console.log(err.response?.data?.message || err.message);
      }
    }
  };

  return (
    <div className="mt-140 w-full z-10">
      {step == 1 && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg"
        >
          <NavBar step={step} />
          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-x-15 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên đầu <span className="text-red-500">*</span>
              </label>
              <input
                {...register("firstName")}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên gia đình <span className="text-red-500">*</span>
              </label>
              <input
                {...register("lastName")}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-x-15 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                {...register("phoneNumber")}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>

          {/* Address, City, State, Zip, Country */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <input
              {...register("address")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-x-15 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Thành phố <span className="text-red-500">*</span>
              </label>
              <input
                {...register("city")}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.city ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vịnh / Xã <span className="text-red-500">*</span>
              </label>
              <input
                {...register("stateProvince")}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.stateProvince ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.stateProvince && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.stateProvince.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-x-15 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mã bưu điện <span className="text-red-500">*</span>
              </label>
              <input
                {...register("zipPostalCode")}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.zipPostalCode ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.zipPostalCode && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.zipPostalCode.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Đất nước <span className="text-red-500">*</span>
              </label>
              <select
                {...register("country")}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.country ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="VN">Vietnam</option>
                <option value="JP">Japan</option>
                <option value="KR">South Korea</option>
                <option value="SG">Singapore</option>
              </select>
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#6B7FFF] to-[#6ADBB9] text-white py-3 rounded-lg font-semibold text-lg hover:brightness-85 cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            Bước kế tiếp →
          </button>
        </form>
      )}
      {step == 2 && (
        <div
          className={
            "max-w-3xl mx-auto px-6 py-12 bg-white rounded-xl shadow-lg flex flex-col "
          }
        >
          <NavBar step={step} />
          <Email
            user_email={"giaobao2kk5@gmail.com"}
            setStep={setStep}
            sendEmail={sendEmail}
            isSending={isSending}
          />
        </div>
      )}

      {step === 3 && (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg flex flex-col">
          <NavBar step={step} />

          <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-4">
            Review Your Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-15">
            <div>
              <p className="text-gray-500 font-semibold">First Name</p>
              <p className="text-gray-800">{getValues("firstName")}</p>
            </div>

            <div>
              <p className="text-gray-500 font-semibold">Last Name</p>
              <p className="text-gray-800">{getValues("lastName")}</p>
            </div>

            <div>
              <p className="text-gray-500 font-semibold">Phone Number</p>
              <p className="text-gray-800">{getValues("phoneNumber")}</p>
            </div>

            <div>
              <p className="text-gray-500 font-semibold">Address</p>
              <p className="text-gray-800">{getValues("address")}</p>
            </div>

            <div>
              <p className="text-gray-500 font-semibold">City</p>
              <p className="text-gray-800">{getValues("city")}</p>
            </div>

            <div>
              <p className="text-gray-500 font-semibold">State/Province</p>
              <p className="text-gray-800">{getValues("stateProvince")}</p>
            </div>

            <div>
              <p className="text-gray-500 font-semibold">Zip/Postal Code</p>
              <p className="text-gray-800">{getValues("zipPostalCode")}</p>
            </div>

            <div>
              <p className="text-gray-500 font-semibold">Country</p>
              <p className="text-gray-800">{getValues("country")}</p>
            </div>
          </div>

          <Link
            onClick={confirm}
            to="/profile"
            className="flex justify-center mt-6 w-full bg-[#6ADBB9] text-white py-3 rounded-lg font-semibold hover:bg-[#39977b] cursor-pointer transition-colors"
          >
            Confirm & Submit
          </Link>

          <button
            onClick={() => setStep(1)}
            type="button"
            className="mt-6 w-full border border-[#6ADBB9] text-black py-3 rounded-lg font-semibold hover:border-[#39977b] border-3 cursor-pointer transition-colors"
          >
            Return to step 1
          </button>
        </div>
      )}
    </div>
  );
};

export default Form;
