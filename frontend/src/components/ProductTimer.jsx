import { useState, useEffect } from "react";

const ProductTimer = ({ end_time }) => {
  const [remain, setRemain] = useState(0);

  useEffect(() => {
    const end_date = end_time ? new Date(end_time).getTime() : Date.now();

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = end_date - now;
      setRemain(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const days = Math.floor(remain / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remain / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remain / (1000 * 60)) % 60);
  const seconds = Math.floor((remain / 1000) % 60);

  return (
    <div
      className={`${
        remain > 1000 * 10 ? `bg-[#FFF3CD]` : `bg-[#ffcdcd]`
      } h-full flex justify-center items-center gap-[5px]`}
    >
      <svg
        width={14}
        height={16}
        viewBox="0 0 14 16"
        fill="none"
        className="mb-[1px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.70378 2.52632C3.00748 2.52632 0 5.54863 0 9.26316C0 12.9777 3.00748 16 6.70378 16C10.4001 16 13.4076 12.9777 13.4076 9.26316C13.4076 5.54863 10.4001 2.52632 6.70378 2.52632ZM7.54175 9.26316H5.8658V5.05263H7.54175V9.26316ZM4.18986 0H9.21769V1.68421H4.18986V0ZM12.3241 1.93095L14 3.61516L12.8151 4.80589L11.1392 3.12168L12.3241 1.93095Z"
          fill={remain > 1000 * 10 ? "#856404" : "#850404"}
        />
      </svg>
      {remain === 0 && (
        <p className="text-[#850404] font-bold text-[18px] py-1.5">
          AUCTION ENDED
        </p>
      )}
      {remain > 0 && (
        <p
          className={`${
            remain > 1000 * 10 ? `text-[#856404]` : `text-[#850404]`
          } text-[15px] font-bold py-2`}
        >
          {`${days}:${hours}:${minutes}:${seconds}`}
        </p>
      )}
    </div>
  );
};

export default ProductTimer;
