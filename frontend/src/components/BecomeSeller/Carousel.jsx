import React from "react";
import { useState, useEffect } from "react";

const Carousel = () => {
  const benefits = [
    "Reach thousands of active buyers searching for items like yours!",
    "Set your own prices and control your selling terms!",
    "Zero listing fees - only pay when you make a sale!",
    "Secure payment processing with buyer protection!",
    "Easy-to-use seller dashboard to manage all your listings!",
    "Get real-time notifications when buyers place bids!",
    "Build your seller reputation with our rating system!",
    "Interact with bidders on the fly!",
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
      <div className="bg-white rounded-3xl shadow-xl py-12 px-8 max-w-1/3 w-full">
        <div className="relative h-32 flex items-center justify-center">
          <p
            key={currentIndex}
            className="text-[26px] Space font-bold text-center leading-relaxed animate-fade-in"
            style={{ color: "#3b3b3b" }}
          >
            {benefits[currentIndex]}
          </p>
        </div>

        <div className="flex justify-center gap-2 mt-6">
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
