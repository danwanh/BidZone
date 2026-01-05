import NavBar from "./NavBar";
import { useSearchParams } from "react-router-dom";
import ProfileProductList from "./ProfileProductList";

const ProductList = ({ user }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  const labels = ["Đang đấu giá", "Yêu thích", "Đã mua"];
  if (user.role == "seller") {
    labels.push("Đang bán");
    labels.push("Đã bán");
  }

  return (
    <div className="w-full bg-white p-10 rounded-[15px] shadow-lg flex flex-col gap-4">
      <NavBar labels={labels} />

      {tab == "Đang đấu giá" && (
        <ProfileProductList baseURL={`/api/bids/user/bidding/${user._id}`} />
      )}

      {tab == "Yêu thích" && (
        <ProfileProductList baseURL={`/api/watchlist/user/${user._id}`} />
      )}

      {tab == "Đã mua" && (
        <ProfileProductList baseURL={`/api/product/user/${user._id}`} />
      )}

      {tab == "Đang bán" && (
        <ProfileProductList
          baseURL={`/api/product/seller/${user._id}`}
          xtra={"status=active"}
        />
      )}

      {tab == "Đã bán" && (
        <ProfileProductList
          baseURL={`/api/product/seller/${user._id}`}
          xtra={"status=ended&bidder_id_exists=true"}
        />
      )}
    </div>
  );
};
export default ProductList;
