import { Link } from "react-router-dom";

const ProductCard = () => {
  return (
    <div className="w-full h-full">
  <div className="w-[292px] h-[430px] flex flex-col bg-[#ffffff] rounded-[0.6rem] gap-[5px] overflow-hidden shadow-md">
    <img className="w-full h-[215px]" src />
    <div className="flex justify-between text-black-500 px-[10px] text-[14px]">
      <p>21/Dec/2025</p>
      <svg width={21} height={18} viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.1865 0.5C16.5951 0.501588 17.9463 1.0623 18.9424 2.05859C19.8759 2.99253 20.4266 4.23796 20.4932 5.55078L20.5 5.81445C20.4997 8.86225 18.2234 11.702 15.7539 13.8652C13.3105 16.0056 10.8114 17.368 10.6211 17.4688L10.6182 17.4697C10.5818 17.4893 10.5413 17.5 10.5 17.5C10.4587 17.5 10.4182 17.4893 10.3818 17.4697L10.3789 17.4688L9.83984 17.1641C8.94224 16.6381 7.07854 15.4704 5.24609 13.8652C2.77656 11.702 0.50029 8.86225 0.5 5.81445C0.501588 4.40558 1.06176 3.05486 2.05762 2.05859C3.05354 1.06243 4.40412 0.501737 5.8125 0.5C7.60227 0.5 9.14495 1.26698 10.1006 2.54004L10.5 3.07324L10.8994 2.54004C11.8549 1.26721 13.3972 0.500279 15.1865 0.5Z" stroke="#171B22" />
      </svg>
    </div>
    <div className="px-[10px] flex flex-col">
      <p className="font-bold">Vintage Rolex Watch</p>
      <p className="text-[#666666] text-[15px]">Rare 1960s Rolex Submariner in excellent condition</p>
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
