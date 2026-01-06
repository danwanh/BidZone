import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const SideBar = ({ user, isOwnProfile }) => {
  const [showPopUp, setShowPopUp] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { logout } = useAuth();
  const [userData, setUserData] = useState(user);
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [isComment, setIsComment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UseForm cho form thông tin cá nhân
  const {
    register: registerPersonalInfo,
    handleSubmit: handleSubmitPersonalInfo,
    formState: { errors: errorsPersonalInfo },
    reset,
  } = useForm();

  // UseForm cho form cập nhật mật khẩu
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
  } = useForm();

  // Hàm xử lý form thông tin cá nhân
  const onSubmitPersonalInfo = async (data) => {
    console.log("Form submitted:", data);
    try {
      if (!user?._id) {
        console.error("User not defined");
        return;
      }
      const response = await api.put(`/api/users/update/${user._id}`, data);
      reset(data);

      setUserData((prev) => ({ ...prev, ...data }));
      setIsEditing(false);
      console.log(response?.data?.message || response);
      toast.success("Đã cập nhật thông tin cá nhân thành công");
    } catch (err) {
      console.error(err.response?.data?.message || err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadComment = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get(`/api/ratings/user/${user._id}`);
        if (isMounted) {
          setComments(res.data);
        }
      } catch (error) {
        console.error(
          "Error loading products",
          error.response?.data?.message || error.message
        );
        if (isMounted) setError(error.message || "Unable to load products");
        toast.error("Error loading comments");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadComment();
    return () => {
      isMounted = false;
    };
  }, []);

  // Hàm xử lý form cập nhật mật khẩu
  const onSubmitPassword = async (data) => {
    try {
      console.log(data);
      const res = await api.post("api/users/change-password", {
        ...data,
      });
      console.log(res);
      if (res) {
        toast.success(res.data.message);
        setShowPopUp(false);
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      if (message === "Wrong password") {
        toast.error("Incorrect password, did you forget your old password?");
      } else {
        console.error(error);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  if (user && userData.is_deleted) {
    return (
      <div className="bg-white w-full h-fit rounded-[15px] p-[30px] flex flex-col gap-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
        <p className="text-gray-500 text-center py-4">
          Tài khoản này đã bị xóa.
        </p>
      </div>
    );
  }

  if (isComment) {
    return (
      <div className="bg-white w-full h-fit rounded-[15px] p-[30px] flex flex-col gap-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] h-full flex flex-col min-h-[600px]">
        {(!comments || comments.length === 0) && (
          <p className="text-gray-500 text-center py-4">
            Chưa có đánh giá nào.
          </p>
        )}

        <div
          className="flex-1 overflow-y-auto flex flex-col gap-2 pr-2 [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            [&::-webkit-scrollbar-thumb]:rounded-full
            hover:[&::-webkit-scrollbar-thumb]:bg-gray-400"
        >
          {comments.map((c) => {
            const isPositive = c.points > 0;

            const userName = c.from_user_id?.name || "Người dùng ẩn danh";
            const userRole = c.from_user_id?.role || "user";

            return (
              <div
                key={c._id}
                className="bg-white p-5 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                {/* Header: Avatar, Name, Date */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar Circle */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm
                  ${
                    isPositive
                      ? "bg-gradient-to-br from-green-400 to-green-600"
                      : "bg-gradient-to-br from-red-400 to-red-600"
                  }`}
                    >
                      {getInitials(userName)}
                    </div>

                    {/* Name & Role */}
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm leading-tight">
                        {userName}
                      </h4>
                      <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                        {userRole}
                      </span>
                    </div>
                  </div>

                  {/* Date */}
                  <span className="text-xs text-gray-400 font-medium">
                    {formatDate(c.createdAt)}
                  </span>
                </div>

                {/* Comment Content */}
                <div className="pl-13">
                  {/* Padding left để thẳng hàng với tên */}
                  {/* Rating Badge */}
                  <div className="mb-2">
                    {isPositive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                        <svg
                          className="w-3 h-3 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v7.333l-2 2V10.333z" />
                        </svg>
                        Hài lòng (+1)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                        <svg
                          className="w-3 h-3 fill-current transform rotate-180"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v7.333l-2 2V10.333z" />
                        </svg>
                        Không hài lòng (-1)
                      </span>
                    )}
                  </div>
                  {/* Text Body */}
                  <p
                    className="text-gray-700 text-[15px] leading-relaxed break-words max-h-80 overflow-y-scroll [&::-webkit-scrollbar]:w-1
                    [&::-webkit-scrollbar-track]:bg-transparent
                    [&::-webkit-scrollbar-thumb]:bg-gray-200
                    [&::-webkit-scrollbar-thumb]:rounded-full"
                  >
                    "{c.comment}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center">
          <button
            type="button"
            onClick={() => setIsComment(false)}
            className="text-sm bg-[#667EEA] text-white px-6 py-2.5 rounded-lg cursor-pointer hover:bg-[#4961d0] transition-colors font-medium shadow-sm"
          >
            Trở về thông tin cá nhân
          </button>
        </div>
      </div>
    );
  } else
    return (
      <div className="h-full text-[15px] h-[600px]">
        {/* ---------- POPUP ---------- */}
        {showPopUp && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowPopUp(false)} // close when clicking outside
          >
            <div
              className="bg-white p-8 rounded-xl shadow-xl w-[90%] max-w-md"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            >
              <h2 className="text-xl font-semibold mb-4">CẬP NHẬT MẬT KHẨU</h2>

              <form
                className="flex flex-col gap-5"
                onSubmit={handleSubmitPassword(onSubmitPassword)}
              >
                <div className="w-full h-fit flex flex-col justify-center gap-[5px]">
                  <div className="text-[#666666] font-bold text-[13px] tracking-[0.5px]">
                    MẬT KHẨU CŨ
                  </div>
                  <input
                    type="password"
                    {...registerPassword("oldPassword")}
                    className="bg-[#f8f9fa]
  border-2 border-[#e0e0e0]
  rounded-[8px]
  px-[15px] py-[5px]
  placeholder:text-[rgb(106,106,106)]
  outline-none"
                  />
                </div>
                <Link to="/profile" className="text-[#a2a2a2] mt-[-14px]">
                  Quên mật khẩu?
                </Link>
                <div className="w-full h-fit flex flex-col justify-center gap-[5px]">
                  <div className="text-[#666666] font-bold text-[13px] tracking-[0.5px]">
                    MẬT KHẨU MỚI
                  </div>
                  <input
                    type="password"
                    {...registerPassword("newPassword")}
                    className="bg-[#f8f9fa]
  border-2 border-[#e0e0e0]
  rounded-[8px]
  px-[15px] py-[5px]
  placeholder:text-[rgb(106,106,106)]
  outline-none"
                  />
                </div>

                <div className="flex justify-between px-5 w-full">
                  <button
                    type="submit"
                    className="cursor-pointer bg-[#667EEA] text-white font-bold px-4 py-2 rounded-[10rem] w-1/3 hover:shadow-xl hover:scale-[1.1] transition-all transition-100 ease-in-out"
                  >
                    CẬP NHẬT
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPopUp(false)}
                    className="cursor-pointer border px-4 py-2 rounded-[10rem] w-1/3 font-bold hover:shadow-xl hover:scale-[1.1] transition-all transition-100 ease-in-out"
                  >
                    KHÔNG
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ---------- MAIN FORM ---------- */}
        <form
          className="bg-white w-full h-fit rounded-[15px] p-[30px] flex flex-col gap-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] h-full flex flex-col justify-between"
          onSubmit={handleSubmitPersonalInfo(onSubmitPersonalInfo)}
        >
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <svg
                width="18"
                height="24"
                viewBox="0 0 19 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 26H19V21.3571C18.9975 19.634 18.2961 17.9821 17.0495 16.7637C15.8029 15.5452 14.1129 14.8596 12.35 14.8571H6.65C4.88708 14.8596 3.19709 15.5452 1.95052 16.7637C0.703943 17.9821 0.00251307 19.634 0 21.3571V26ZM2.85 6.5C2.85 7.78558 3.24002 9.04229 3.97073 10.1112C4.70144 11.1801 5.74003 12.0132 6.95515 12.5052C8.17028 12.9972 9.50738 13.1259 10.7974 12.8751C12.0873 12.6243 13.2722 12.0052 14.2023 11.0962C15.1323 10.1872 15.7656 9.02896 16.0222 7.76809C16.2788 6.50721 16.1471 5.20028 15.6438 4.01256C15.1405 2.82484 14.2881 1.80968 13.1945 1.09545C12.101 0.381218 10.8152 0 9.5 0C7.73631 0 6.04486 0.684819 4.79774 1.90381C3.55062 3.12279 2.85 4.77609 2.85 6.5Z"
                  fill="#171B22"
                />
              </svg>
              <div className="text-[#171a22] font-bold text-[26px]">
                Thông tin cá nhân
              </div>
            </div>

            {/* NAME + AGE DISPLAY */}
            <div className="pb-2 border-b border-gray-100">
              <p className="text-[#171a22] font-bold text-xl mb-2">
                {userData.name}
              </p>
              <div className="flex gap-5 flex-col md:flex-row">
                <div className="flex gap-2 items-center">
                  <svg
                    width="19"
                    height="21"
                    viewBox="0 0 19 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.55198 1.95796C7.65103 0.708975 9.00264 -0.256819 10.4594 0.0611047L10.8571 0.149269C11.5626 0.304223 12.1889 0.7584 12.3992 1.43833C12.7344 2.52835 13.2114 4.79256 12.4937 7.46285C12.7181 7.43575 12.9432 7.41304 13.1687 7.39473C14.2552 7.3079 15.712 7.29855 17.0026 7.67525C17.792 7.90634 18.5173 8.58494 18.8312 9.37574C19.1116 10.0864 19.075 10.928 18.4746 11.6907C18.562 11.851 18.6321 12.0126 18.6849 12.1756C18.8022 12.5363 18.8571 12.933 18.8571 13.3191C18.8571 13.7051 18.8022 14.1019 18.6849 14.4625C18.6255 14.6429 18.5478 14.8272 18.4411 15.0022C18.6986 15.5192 18.6041 16.0962 18.4365 16.5357C18.264 16.9693 18.0129 17.3757 17.6929 17.7393C17.7752 17.9423 17.8087 18.1561 17.8087 18.3604C17.8087 18.7679 17.6731 19.1953 17.4232 19.5787C16.9142 20.3615 15.904 21 14.4762 21H9.14283C8.22093 21 7.51236 20.8918 6.90893 20.7088C6.38997 20.5429 5.89411 20.326 5.43084 20.0623L5.3577 20.0222C4.5897 19.6121 3.83542 19.2087 2.20647 19.0577C1.03924 18.9482 0 18.1227 0 16.9926V11.6493C0 10.5139 1.04381 9.73641 2.0678 9.49196C3.36152 9.18205 4.46627 8.44067 5.31656 7.60846C6.16989 6.7709 6.70932 5.89862 6.89979 5.41906C7.20303 4.65096 7.44227 3.36324 7.55198 1.9593V1.95796Z"
                      fill="#667EEA"
                    />
                  </svg>
                  <p className="text-[#667eea] font-bold">
                    {userData.rating_pos}
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <svg
                    width="19"
                    height="21"
                    viewBox="0 0 19 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="rotate-180"
                  >
                    <path
                      d="M7.55198 1.95796C7.65103 0.708975 9.00264 -0.256819 10.4594 0.0611047L10.8571 0.149269C11.5626 0.304223 12.1889 0.7584 12.3992 1.43833C12.7344 2.52835 13.2114 4.79256 12.4937 7.46285C12.7181 7.43575 12.9432 7.41304 13.1687 7.39473C14.2552 7.3079 15.712 7.29855 17.0026 7.67525C17.792 7.90634 18.5173 8.58494 18.8312 9.37574C19.1116 10.0864 19.075 10.928 18.4746 11.6907C18.562 11.851 18.6321 12.0126 18.6849 12.1756C18.8022 12.5363 18.8571 12.933 18.8571 13.3191C18.8571 13.7051 18.8022 14.1019 18.6849 14.4625C18.6255 14.6429 18.5478 14.8272 18.4411 15.0022C18.6986 15.5192 18.6041 16.0962 18.4365 16.5357C18.264 16.9693 18.0129 17.3757 17.6929 17.7393C17.7752 17.9423 17.8087 18.1561 17.8087 18.3604C17.8087 18.7679 17.6731 19.1953 17.4232 19.5787C16.9142 20.3615 15.904 21 14.4762 21H9.14283C8.22093 21 7.51236 20.8918 6.90893 20.7088C6.38997 20.5429 5.89411 20.326 5.43084 20.0623L5.3577 20.0222C4.5897 19.6121 3.83542 19.2087 2.20647 19.0577C1.03924 18.9482 0 18.1227 0 16.9926V11.6493C0 10.5139 1.04381 9.73641 2.0678 9.49196C3.36152 9.18205 4.46627 8.44067 5.31656 7.60846C6.16989 6.7709 6.70932 5.89862 6.89979 5.41906C7.20303 4.65096 7.44227 3.36324 7.55198 1.9593V1.95796Z"
                      fill="#4b60ba"
                    />
                  </svg>
                  <p className="text-[#667eea] font-bold">
                    {userData.rating_neg}
                  </p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsComment(true)}
                    className="hover:bg-[#667EEA] ring ring-inset ring-2 ring-[#98a6e4] hover:ring-[#667EEA] rounded-lg py-1 px-4 text-[#98a6e4] hover:text-white transition-all duration-100 ease-in-out cursor-pointer md:ml-auto text-sm font-medium"
                  >
                    Xem nhận xét
                  </button>
                )}
              </div>
            </div>

            <div className="w-full h-fit flex flex-col justify-center gap-[5px]">
              <div className="text-[#666666] font-bold text-[13px] tracking-[0.5px]">
                HỌ TÊN
              </div>
              {isEditing ? (
                <input
                  {...registerPersonalInfo("name")}
                  type="text"
                  placeholder={userData.name}
                  className="bg-[#f8f9fa]
  border-2 border-[#e0e0e0]
  rounded-[8px]
  px-[15px] py-[5px]
  placeholder:text-[rgb(106,106,106)]
  outline-none"
                />
              ) : (
                <p className="text-[#282e40] text-[18px] font-semibold">
                  {userData.name || "Chưa cập nhật"}
                </p>
              )}
            </div>

            <div className="w-full h-fit flex flex-col justify-center gap-[5px]">
              <div className="text-[#666666] font-bold text-[13px] tracking-[0.5px]">
                TÊN TÀI KHOẢN
              </div>
              {isEditing ? (
                <input
                  {...registerPersonalInfo("username")}
                  type="text"
                  placeholder={userData.username}
                  className="bg-[#f8f9fa]
  border-2 border-[#e0e0e0]
  rounded-[8px]
  px-[15px] py-[5px]
  placeholder:text-[rgb(106,106,106)]
  outline-none"
                />
              ) : (
                <p className="text-[#282e40] text-[18px] font-semibold">
                  {userData.username || "Chưa cập nhật"}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-4 xl:flex-row justify-between w-full">
              <div className="w-full h-fit flex flex-col justify-center gap-[5px] flex-1">
                <div className="text-[#666666] font-bold text-[13px] tracking-[0.5px]">
                  SỐ ĐIỆN THOẠI
                </div>
                {isEditing ? (
                  <input
                    {...registerPersonalInfo("phonenumber")}
                    type="text"
                    placeholder={userData.phone}
                    className="bg-[#f8f9fa]
  border-2 border-[#e0e0e0]
  rounded-[8px]
  px-[15px] py-[5px]
  placeholder:text-[rgb(106,106,106)]
  outline-none"
                  />
                ) : (
                  <p className="text-[#282e40] text-[18px] font-semibold">
                    {userData.phone || "Chưa cập nhật"}
                  </p>
                )}
              </div>

              <div className="w-full h-fit flex flex-col justify-center gap-[5px] w-full xl:w-1/3">
                <div className="text-[#666666] font-bold text-[13px] tracking-[0.5px]">
                  GIỚI TÍNH
                </div>
                {isEditing ? (
                  <select
                    {...registerPersonalInfo("gender")}
                    className="bg-[#f8f9fa]
  border-2 border-[#e0e0e0]
  rounded-[8px]
  px-[15px] py-[5px]
  placeholder:text-[rgb(106,106,106)]
  outline-none"
                  >
                    <option value="">Nam</option>
                    <option>Nữ</option>
                    <option>Khác</option>
                  </select>
                ) : (
                  <p className="text-[#282e40] text-[18px] font-semibold">
                    {userData.gender || "Chưa cập nhật"}
                  </p>
                )}
              </div>
            </div>

            <div className="w-full h-fit flex flex-col justify-center gap-[5px]">
              <div className="text-[#666666] font-bold text-[13px] tracking-[0.5px]">
                ĐỊA CHỈ EMAIL
              </div>
              {isEditing ? (
                <input
                  {...registerPersonalInfo("email")}
                  type="email"
                  placeholder={userData.email}
                  className="bg-[#f8f9fa]
  border-2 border-[#e0e0e0]
  rounded-[8px]
  px-[15px] py-[5px]
  placeholder:text-[rgb(106,106,106)]
  outline-none"
                />
              ) : (
                <p className="text-[#282e40] text-[18px] font-semibold whitespace-normal break-all">
                  {userData.email || "Chưa cập nhật"}
                </p>
              )}
            </div>

            <div className="w-full h-fit flex flex-col justify-center gap-[5px]">
              <div className="text-[#666666] font-bold text-[13px] tracking-[0.5px]">
                NGÀY SINH
              </div>
              {isEditing ? (
                <input
                  {...registerPersonalInfo("dob")}
                  type="date"
                  className="bg-[#f8f9fa]
  border-2 border-[#e0e0e0]
  rounded-[8px]
  px-[15px] py-[5px]
  placeholder:text-[rgb(106,106,106)]
  outline-none"
                  defaultValue={userData?.dob ? userData.dob.slice(0, 10) : ""}
                />
              ) : (
                <p className="text-[#282e40] text-[18px] font-semibold">
                  {userData?.dob
                    ? new Date(userData.dob).toLocaleDateString("vi-VN")
                    : "Chưa cập nhật"}
                </p>
              )}
            </div>

            {/* CHANGE PASSWORD BUTTON */}
            {isOwnProfile && (
              <div className="w-full h-fit flex flex-col justify-center gap-[5px]">
                <p
                  className="text-[#666666] font-bold text-[13px] tracking-[0.5px] cursor-pointer hover:text-blue-700 w-fit inline-flex items-center gap-1"
                  onClick={() => setShowPopUp(true)}
                >
                  ĐỔI MẬT KHẨU?
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 mt-6 pt-4 border-t border-gray-50">
            {isOwnProfile && (
              <>
                {isEditing ? (
                  <div className="flex gap-3 md:flex-row flex-col">
                    <button
                      className="bg-[#667EEA] text-white rounded-lg py-2.5 px-4 flex-1 font-bold hover:bg-[#4961d0] transition-colors shadow-sm cursor-pointer"
                      type="submit"
                    >
                      Lưu thay đổi
                    </button>
                    <button
                      className="bg-gray-100 text-gray-700 rounded-lg py-2.5 px-4 flex-1 font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                      type="button"
                      onClick={() => setIsEditing(false)}
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <button
                    className="bg-[#667EEA] text-white rounded-lg py-2.5 px-4 w-full font-bold hover:bg-[#4961d0] transition-colors shadow-sm cursor-pointer"
                    type="button"
                    onClick={() => setIsEditing(true)}
                  >
                    Chỉnh sửa thông tin
                  </button>
                )}
              </>
            )}

            {isOwnProfile && (
              <div className="flex justify-end">
                <button
                  className="bg-red-50 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer font-bold text-sm border border-red-100"
                  type="button"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    );
};

export default SideBar;
