import React from "react";

const NavBar = ({ step }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex-1 flex flex-col items-center">
        <div
          className={`w-12 h-12 rounded-full ${
            step === 1
              ? " bg-[#6ADBB9] text-white "
              : " bg-gray-300 text-gray-600 "
          } flex items-center justify-center font-bold text-lg mb-2`}
        >
          1
        </div>
        <span
          className={`text-xs font-medium ${
            step == 1 ? "text-[#6ADBB9]" : "text-gray-500"
          }`}
        >
          Thông tin cá nhân
        </span>
      </div>
      <div className="flex-1 h-0.5 bg-gray-300 -mx-4"></div>
      <div className="flex-1 flex flex-col items-center">
        <div
          className={`w-12 h-12 rounded-full ${
            step === 2
              ? " bg-[#6ADBB9] text-white "
              : " bg-gray-300 text-gray-600 "
          } flex items-center justify-center font-bold text-lg mb-2`}
        >
          2
        </div>
        <span
          className={`text-xs font-medium ${
            step == 2 ? "text-[#6ADBB9]" : "text-gray-500"
          }`}
        >
          Xác thực
        </span>
      </div>
      <div className="flex-1 h-0.5 bg-gray-300 -mx-4"></div>
      <div className="flex-1 flex flex-col items-center">
        <div
          className={`w-12 h-12 rounded-full ${
            step === 3
              ? " bg-[#6ADBB9] text-white "
              : " bg-gray-300 text-gray-600 "
          } flex items-center justify-center font-bold text-lg mb-2`}
        >
          3
        </div>
        <span
          className={`text-xs font-medium ${
            step == 3 ? "text-[#6ADBB9]" : "text-gray-500"
          }`}
        >
          Xem lại thông tin
        </span>
      </div>
    </div>
  );
};

export default NavBar;
