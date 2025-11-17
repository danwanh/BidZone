import { Link } from "react-router-dom";

const ProductCard = () => {
  return (
    <div className="w-full h-full">
  <div className="w-[255px] h-[373px] flex flex-col bg-[#ffffff] rounded-[0.6rem] gap-[5px] overflow-hidden shadow-md">
    <img className="w-full h-[200px]"/>
    <div className="flex justify-between text-black-500 px-[10px] text-[14px]">
      <p>21/Dec/2025</p>
      <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.75 6.56387C20.75 13.1279 11.483 18.441 11.0884 18.6605C10.9844 18.7192 10.8681 18.75 10.75 18.75C10.6319 18.75 10.5156 18.7192 10.4116 18.6605C10.017 18.441 0.75 13.1279 0.75 6.56387C0.751654 5.02247 1.33541 3.5447 2.3732 2.45476C3.41099 1.36483 4.81806 0.751737 6.28571 0.75C8.12946 0.75 9.74375 2.64152 10.75 4.04904C11.7563 2.64152 13.3705 0.75 15.2143 0.75C16.6819 0.751737 18.089 1.36483 19.1268 2.45476C20.1646 3.5447 20.7483 5.02247 20.75 6.56387Z" 
        stroke="#171B22" strokeWidth="1.5"/>
      </svg>


    </div>
    <div className="px-[10px] flex flex-col">
      <p className="font-bold">Vintage Rolex Watch</p>
    </div>
    {/* Gia and Lan ra gia */}
    <div className="px-[10px] flex justify-between">
      {/* Left */}
      <div className="flex flex-col leading-[24px]">
        <p className="text-[16px] text-[#666666]">Gia cao nhat</p>
        <p className="text-[22px] font-bold text-orange-600">125000</p>
        <p>User1***</p>
      </div>
      {/* right */}
      <div className="flex flex-col text-right leading-[24px]">
        <p className="text-[16px] text-[#666666]">Lan ra gia</p>
        <p className="text-[22px] font-bold text-orange-600">12</p>
      </div>
    </div>
    <div className="bg-[#FFF3CD] h-full flex justify-center items-center gap-[5px]">
      <svg width={14} height={16} viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.70378 2.52632C3.00748 2.52632 0 5.54863 0 9.26316C0 12.9777 3.00748 16 6.70378 16C10.4001 16 13.4076 12.9777 13.4076 9.26316C13.4076 5.54863 10.4001 2.52632 6.70378 2.52632ZM7.54175 9.26316H5.8658V5.05263H7.54175V9.26316ZM4.18986 0H9.21769V1.68421H4.18986V0ZM12.3241 1.93095L14 3.61516L12.8151 4.80589L11.1392 3.12168L12.3241 1.93095Z" fill="#856404" />
      </svg>
      <p className="text-[#856404] text-[15px] font-bold">0:59:23</p>
    </div>
  </div>
</div>

  );
};

export default ProductCard;
