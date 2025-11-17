import { Link } from "react-router-dom";

const BoughtProductCard = () => {
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
  </div>
</div>

  );
};

export default BoughtProductCard;
