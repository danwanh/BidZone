import { useEffect, useState } from "react";
import api from "../../api/axios";

const TotalCategory = ({ total }) => {
  return (
    <>
      <div className="bg-white/80 rounded-xl px-4 py-2 w-full-1 h-full flex flex-col">
        <p className="text-[24px] font-bold">{total}</p>
        <p className="text-[14px] text-[#404040]">Tổng số danh mục</p>
      </div>
    </>
  );
};

export default TotalCategory;
