import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import http from "../api/axios";
import ProductTimer from "./ProductTimer";
import { useLiked } from "../context/LikedContext";

const ProductCard = ({ product }) => {
  const [showPopup, setShowPopup] = useState(false);
  const { addToLikedList, removeFromLikedList, likedIds } = useLiked();

  const [isLiked, setIsLiked] = useState(likedIds.has(product._id));

  const location = useLocation();
  const is_profile = location.pathname.endsWith("/profile");
  const is_bought = product.seller_id === "6912e02b70323bdb4045f32";

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      vote: null,
      review: "",
    },
  });

  const vote = watch("vote");

  const onSubmit = (data) => {
    console.log(data);
    setShowPopup(false);
  };

  const handleClick = () => {
    setShowPopup(true);
  };

  const handleHuyBan = () => {
    setValue("vote", "down");
    setValue("review", "Người thắng không thanh toán");
    handleSubmit(onSubmit)();
  };

  const handleLike = async (value) => {
    if (value && !isLiked) {
      try {
        setIsLiked(true);
        addToLikedList(product._id);
      } catch (error) {
        console.error("Failed to add to watchlist:", error.message);
      }
    } else if (!value && isLiked) {
      try {
        setIsLiked(false);
        removeFromLikedList(product._id);
      } catch (error) {
        console.error("Failed to remove from watchlist:", error.message);
      }
    }
  };

  return (
    <div className="relative">
      {/* REVIEW POP UP */}
      {showPopup && (
        <div className="flex flex-col gap-2 absolute -inset-y-2 -inset-x-10 bg-white py-6 px-2 rounded-lg h-full shadow-lg border border-black border-[2px] z-50">
          {/* Upvote + Downvote */}
          <div className="flex gap-2">
            {/* UPVOTE */}
            <svg
              onClick={() => setValue("vote", vote === "up" ? null : "up")}
              className={`w-5 h-5 cursor-pointer transition stroke-[#667EEA] overflow-visible
                ${vote === "up" ? "fill-[#667EEA]" : ""}`}
              viewBox="0 0 16 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.35956 1.77149C6.44297 0.641453 7.58117 -0.23236 8.80792 0.0552852L9.14283 0.135052C9.73696 0.275249 10.2644 0.686171 10.4414 1.30135C10.7237 2.28756 11.1254 4.33613 10.521 6.75211C10.71 6.72758 10.8995 6.70703 11.0895 6.69047C12.0044 6.61191 13.2311 6.60345 14.318 6.94427C14.9827 7.15336 15.5935 7.76732 15.8578 8.48281C16.094 9.12578 16.0632 9.8872 15.5576 10.5773C15.6311 10.7223 15.6902 10.8686 15.7347 11.016C15.8335 11.3423 15.8797 11.7013 15.8797 12.0506C15.8797 12.3999 15.8335 12.7588 15.7347 13.0851C15.6846 13.2483 15.6192 13.4151 15.5293 13.5734C15.7462 14.0411 15.6666 14.5632 15.5255 14.9609C15.3802 15.3532 15.1688 15.7209 14.8993 16.0498C14.9686 16.2335 14.9968 16.4269 14.9968 16.6118C14.9968 16.9804 14.8826 17.3672 14.6722 17.7141C14.2436 18.4223 13.3928 19 12.1904 19H7.69923C6.92289 19 6.3262 18.9021 5.81805 18.7365C5.38103 18.5864 4.96346 18.3902 4.57334 18.1516L4.51175 18.1153C3.86501 17.7443 3.22983 17.3793 1.85808 17.2427C0.875146 17.1436 0 16.3967 0 15.3742V10.5398C0 9.51253 0.878995 8.80913 1.74131 8.58796C2.83075 8.30757 3.76107 7.6368 4.4771 6.88384C5.1957 6.12605 5.64995 5.33684 5.81035 4.90296C6.06571 4.20801 6.26717 3.04293 6.35956 1.7727V1.77149Z"
                strokeWidth={2}
              />
            </svg>

            {/* DOWNVOTE (same svg for example) */}
            <svg
              onClick={() => setValue("vote", vote === "down" ? null : "down")}
              className={`w-5 h-5 cursor-pointer transition stroke-[#667EEA] overflow-visible
                ${vote === "down" ? "fill-[#667EEA]" : ""}`}
              viewBox="0 0 16 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ transform: "rotate(180deg)" }} // flipped for downvote
            >
              <path
                d="M6.35956 1.77149C6.44297 0.641453 7.58117 -0.23236 8.80792 0.0552852L9.14283 0.135052C9.73696 0.275249 10.2644 0.686171 10.4414 1.30135C10.7237 2.28756 11.1254 4.33613 10.521 6.75211C10.71 6.72758 10.8995 6.70703 11.0895 6.69047C12.0044 6.61191 13.2311 6.60345 14.318 6.94427C14.9827 7.15336 15.5935 7.76732 15.8578 8.48281C16.094 9.12578 16.0632 9.8872 15.5576 10.5773C15.6311 10.7223 15.6902 10.8686 15.7347 11.016C15.8335 11.3423 15.8797 11.7013 15.8797 12.0506C15.8797 12.3999 15.8335 12.7588 15.7347 13.0851C15.6846 13.2483 15.6192 13.4151 15.5293 13.5734C15.7462 14.0411 15.6666 14.5632 15.5255 14.9609C15.3802 15.3532 15.1688 15.7209 14.8993 16.0498C14.9686 16.2335 14.9968 16.4269 14.9968 16.6118C14.9968 16.9804 14.8826 17.3672 14.6722 17.7141C14.2436 18.4223 13.3928 19 12.1904 19H7.69923C6.92289 19 6.3262 18.9021 5.81805 18.7365C5.38103 18.5864 4.96346 18.3902 4.57334 18.1516L4.51175 18.1153C3.86501 17.7443 3.22983 17.3793 1.85808 17.2427C0.875146 17.1436 0 16.3967 0 15.3742V10.5398C0 9.51253 0.878995 8.80913 1.74131 8.58796C2.83075 8.30757 3.76107 7.6368 4.4771 6.88384C5.1957 6.12605 5.64995 5.33684 5.81035 4.90296C6.06571 4.20801 6.26717 3.04293 6.35956 1.7727V1.77149Z"
                strokeWidth={2}
              />
            </svg>
          </div>

          {/* Review Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col h-full"
          >
            <textarea
              {...register("review")}
              className="w-full rounded-lg p-2 h-full mt-4 bg-[#f0f0f0]"
              placeholder="Write your review..."
            ></textarea>

            <div className="flex justify-end gap-4 mt-4">
              <button
                type="button"
                className="px-4 bg-gray-300 rounded-[100px] font-bold"
                onClick={() => setShowPopup(false)}
              >
                Hủy
              </button>

              {product.seller_id == "6912e02b70323bdb4045f327" && (
                <button
                  type="button"
                  className="px-4 bg-gray-300 rounded-[100px] font-bold"
                  onClick={handleHuyBan}
                >
                  Hủy bán
                </button>
              )}
              <button
                type="submit"
                className="px-4 bg-blue-600 text-white font-bold rounded-[100px]"
              >
                Đăng
              </button>
            </div>
          </form>
        </div>
      )}
      <div
        className={`w-[225px] h-fit flex flex-col bg-[#ffffff] rounded-[0.6rem] gap-[5px] overflow-hidden shadow-lg relative hover:-translate-y-2 transition-transform duration-150 ease-in-out hover:cursor-pointer`}
      >
        {is_bought && (
          <div className="absolute bg-[#011876] text-[14px] font-bold text-white -rotate-45 pt-10 px-10 pb-3 -left-13 -top-5">
            ĐÃ MUA
          </div>
        )}
        <img
          className="w-full h-[180px] object-cover object-center"
          src={
            product.image_url != null && product.image_url.length > 0
              ? product.image_url[0]
              : "https://res.cloudinary.com/onlineauctionproject/image/upload/v1763451369/unnamed_hqaokg.png"
          }
          alt="Product"
        />

        <div className="flex justify-between text-black-500 px-[10px] text-[14px]">
          <p>{new Date(product.start_time).toLocaleDateString("en-GB")}</p>
          <svg
            onClick={() => handleLike(isLiked ? false : true)}
            width="22"
            height="20"
            viewBox="0 0 22 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.75 6.56387C20.75 13.1279 11.483 18.441 11.0884 18.6605C10.9844 18.7192 10.8681 18.75 10.75 18.75C10.6319 18.75 10.5156 18.7192 10.4116 18.6605C10.017 18.441 0.75 13.1279 0.75 6.56387C0.751654 5.02247 1.33541 3.5447 2.3732 2.45476C3.41099 1.36483 4.81806 0.751737 6.28571 0.75C8.12946 0.75 9.74375 2.64152 10.75 4.04904C11.7563 2.64152 13.3705 0.75 15.2143 0.75C16.6819 0.751737 18.089 1.36483 19.1268 2.45476C20.1646 3.5447 20.7483 5.02247 20.75 6.56387Z"
              stroke="#171B22"
              strokeWidth="1.5"
              fill={isLiked ? "#171b22" : "none"}
            />
          </svg>
        </div>
        <div className="px-[10px] flex flex-col">
          <p className="font-bold">{product.name}</p>
          {!is_profile && (
            <p className="text-15 text-[#666666]">{product.description}</p>
          )}
        </div>
        {/* Gia and Lan ra gia */}
        {!is_bought && (
          <>
            <div className="px-[10px] flex justify-between">
              {/* Left */}
              <div className="flex flex-col leading-[24px]">
                <p className="text-[16px] text-[#666666]">Giá cao nhất</p>
                <p className="text-[22px] font-bold text-orange-600">
                  ${product.current_price ? product.current_price : 0}
                </p>
                <p>ABC***</p>
              </div>
              {/* right */}
              <div className="flex flex-col text-right leading-[24px]">
                <p className="text-[16px] text-[#666666]">Lần ra giá</p>
                <p className="text-[22px] font-bold text-orange-600">
                  {product.total_bids ? product.total_bids : 0}
                </p>
              </div>
            </div>
            <ProductTimer end_time={product.end_time} />
          </>
        )}

        {is_bought && (
          <div className="h-fit w-full flex justify-center items-center">
            <p
              onClick={() => handleClick()}
              className="hover:shadow-lg border hover:border-[#180154] text-white text-[16px] font-bold bg-[#667EEA] px-5 py-1 rounded-[100px] mb-4"
            >
              Đánh giá
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
