import React from "react";
import { useState, useEffect } from "react";

const Carousel = () => {
  const benefits = [
    "Tiếp cận hàng ngàn khách hàng tiềm năng đang tìm kiếm sản phẩm của bạn!",
    "Tự do định giá và kiểm soát các điều khoản bán hàng!",
    "Miễn phí đăng tin - chỉ thanh toán khi bán thành công!",
    "Hệ thống thanh toán an toàn kèm chính sách bảo vệ người mua!",
    "Công cụ quản lý trực quan giúp bạn dễ dàng theo dõi mọi tin đăng!",
    "Nhận thông báo tức thì ngay khi có người tham gia đấu giá!",
    "Xây dựng uy tín bán hàng thông qua hệ thống đánh giá minh bạch!",
    "Tương tác trực tiếp và nhanh chóng với người đấu giá!",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % benefits.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [benefits.length]);

  return (
    <>
      <div className="rounded-3xl mx-auto py-12 px-8 max-w-1/2 w-full">
        <div className="relative h-38 flex items-center justify-center">
          <p
            key={currentIndex}
            className="text-[50px] Space font-bold text-center leading-relaxed animate-fade-in"
            style={{ color: "#ffffff" }}
          >
            {benefits[currentIndex]}
          </p>
        </div>

        <div className="flex justify-center gap-2 mt-10">
          {benefits.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "w-8 bg-indigo-600" : "w-2 bg-gray-300"
              }`}
            ></div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </>
  );
};

export default Carousel;
