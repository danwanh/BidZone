import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const BecomeSeller = () => {
  return (
    <>
      <Link
        className="absolute left-1/2 -translate-x-1/2 top-22 bg-linear-to-r from-[#667EEA] to-[#42a5a5]
             text-white text-2xl font-bold px-5 py-2 rounded-full border-white border-2 shadow-2xl
             hover:scale-[1.1] transition-all transition-1000 ease-in-out hover:cursor-pointer"
        to="/becomeseller"
      >
        Trở thành người bán
      </Link>
    </>
  );
};

export default BecomeSeller;
