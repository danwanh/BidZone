import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import SideBar from "../components/profile/SideBar";
import ProductList from "../components/profile/ProductList";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import BecomeSeller from "../components/profile/BecomeSeller";

export const ProfilePage = () => {
  const { user: currentUser, loading: authLoading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const userIdFromUrl = searchParams.get("id");
  const [displayedUser, setDisplayedUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      // Trường hợp 1: Có ID trên URL và ID đó KHÁC ID của người đang đăng nhập -> Fetch user lạ
      if (userIdFromUrl && currentUser && userIdFromUrl !== currentUser._id) {
        setLoadingProfile(true);
        try {
          const res = await axios.get(`/api/users/${userIdFromUrl}`);
          setDisplayedUser(res.data.user);
        } catch (error) {
          console.error("Failed to fetch user profile", error);
        } finally {
          setLoadingProfile(false);
        }
      } else {
        setDisplayedUser(currentUser);
        if (!userIdFromUrl && currentUser?._id) {
          setSearchParams({ id: currentUser._id }, { replace: true });
        }
      }
    };

    if (!authLoading) {
      fetchUserProfile();
    }
  }, [userIdFromUrl, currentUser, authLoading]);

  if (authLoading || loadingProfile || !displayedUser)
    return (
      <div className="w-10 h-10 border border-[#5f27ce] border-3 border-b-transparent animate-spin rounded-full"></div>
    );

  // Xác định xem đây có phải profile của chính mình không để cho phép sửa đổi
  const isOwnProfile =
    !userIdFromUrl || (currentUser && userIdFromUrl === currentUser._id);
  return (
    <div className="flex gap-[30px]">
      {isOwnProfile && displayedUser.role === "bidder" && <BecomeSeller />}
      <div className="w-1/3">
        <SideBar user={displayedUser} isOwnProfile={isOwnProfile} />
      </div>

      <div className="flex-1">
        <ProductList user={displayedUser} />
      </div>
    </div>
  );
};
