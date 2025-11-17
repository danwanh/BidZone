import React from "react";
import "./sidebar.css";
import { useState } from "react";

const SideBar = () => {
    const [ showPopUp, setShowPopUp ] = useState(false);
    return (
        <div className="Inter h-fit text-[15px]">
            {showPopUp && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-xl w-[90%] max-w-md">
                    <h2 className="text-xl Inter font-semibold mb-4">CẬP NHẬT MẬT KHẨU</h2>

                    <form className="flex flex-col gap-5">
                        <div className="main_info_wrapper">
                            <div className="info_header">MẬT KHẨU CŨ</div>
                            <input name="password" type="password" className="input_style"></input>
                        </div>

                        <div className="main_info_wrapper">
                            <div className="info_header">MẬT KHẨU MỚI</div>
                            <input name="password" type="password" className="input_style"></input>
                        </div>

                        <div className="flex justify-between px-5 w-full">
                            <button type="submit" className="hover:cursor-pointer bg-blue-600 text-white px-4 py-2 rounded rounded-[10rem] w-1/3">
                                CẬP NHẬT
                            </button>

                            <button onClick={() => setShowPopUp(false)} className="hover:cursor-pointer border px-4 py-2 rounded rounded-[10rem] w-1/3">
                                KHÔNG
                            </button>

                        </div>
                    </form>
                    </div>
                </div>
            )}

            <form className="info">
                <div className="flex items-center gap-2">
                    <svg width="18" height="24" viewBox="0 0 19 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 26H19V21.3571C18.9975 19.634 18.2961 17.9821 17.0495 16.7637C15.8029 15.5452 14.1129 14.8596 12.35 14.8571H6.65C4.88708 14.8596 3.19709 15.5452 1.95052 16.7637C0.703943 17.9821 0.00251307 19.634 0 21.3571V26ZM2.85 6.5C2.85 7.78558 3.24002 9.04229 3.97073 10.1112C4.70144 11.1801 5.74003 12.0132 6.95515 12.5052C8.17028 12.9972 9.50738 13.1259 10.7974 12.8751C12.0873 12.6243 13.2722 12.0052 14.2023 11.0962C15.1323 10.1872 15.7656 9.02896 16.0222 7.76809C16.2788 6.50721 16.1471 5.20028 15.6438 4.01256C15.1405 2.82484 14.2881 1.80968 13.1945 1.09545C12.101 0.381218 10.8152 0 9.5 0C7.73631 0 6.04486 0.684819 4.79774 1.90381C3.55062 3.12279 2.85 4.77609 2.85 6.5Z" fill="#171B22"/>
                    </svg>
                    <div className="big_info">
                        Thông tin cá nhân
                    </div>
                </div>
                <div>
                    <p className="text-[#171a22] font-bold text-xl mb-2">John Doe</p>
                    <div className="flex gap-2 items-center">
                        <svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.55198 1.95796C7.65103 0.708975 9.00264 -0.256819 10.4594 0.0611047L10.8571 0.149269C11.5626 0.304223 12.1889 0.7584 12.3992 1.43833C12.7344 2.52835 13.2114 4.79256 12.4937 7.46285C12.7181 7.43575 12.9432 7.41304 13.1687 7.39473C14.2552 7.3079 15.712 7.29855 17.0026 7.67525C17.792 7.90634 18.5173 8.58494 18.8312 9.37574C19.1116 10.0864 19.075 10.928 18.4746 11.6907C18.562 11.851 18.6321 12.0126 18.6849 12.1756C18.8022 12.5363 18.8571 12.933 18.8571 13.3191C18.8571 13.7051 18.8022 14.1019 18.6849 14.4625C18.6255 14.6429 18.5478 14.8272 18.4411 15.0022C18.6986 15.5192 18.6041 16.0962 18.4365 16.5357C18.264 16.9693 18.0129 17.3757 17.6929 17.7393C17.7752 17.9423 17.8087 18.1561 17.8087 18.3604C17.8087 18.7679 17.6731 19.1953 17.4232 19.5787C16.9142 20.3615 15.904 21 14.4762 21H9.14283C8.22093 21 7.51236 20.8918 6.90893 20.7088C6.38997 20.5429 5.89411 20.326 5.43084 20.0623L5.3577 20.0222C4.5897 19.6121 3.83542 19.2087 2.20647 19.0577C1.03924 18.9482 0 18.1227 0 16.9926V11.6493C0 10.5139 1.04381 9.73641 2.0678 9.49196C3.36152 9.18205 4.46627 8.44067 5.31656 7.60846C6.16989 6.7709 6.70932 5.89862 6.89979 5.41906C7.20303 4.65096 7.44227 3.36324 7.55198 1.9593V1.95796Z" 
                            fill="#667EEA"/>
                        </svg>
                        <p className="text-[#667eea] font-bold">36</p>
                    </div>
                </div>
                <div className="main_info_wrapper">
                    <div className="info_header">HỌ TÊN</div>
                    <input name="fullname" type="text" placeholder="Jon" className="input_style"></input>
                </div>

                <div className="main_info_wrapper">
                    <div className="info_header">TÊN TÀI KHOẢN</div>
                    <input name="username" type="text" placeholder="Jon" className="input_style"></input>
                </div>

                <div className="flex justify-between w-fill">
                    <div className="main_info_wrapper">
                        <div className="info_header">SỐ ĐIÊN THOẠI</div>
                        <input name="phonenumber" type="text" placeholder="09999" className="input_style"></input>
                    </div>

                    <div className="main_info_wrapper max-w-fit">
                        <div className="info_header">GIỚI TÍNH</div>
                        <select className="input_style" name="gender">
                            <option value={""}>a</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Yes</option>
                        </select>
                    </div>

                </div>

                <div className="main_info_wrapper">
                    <div className="info_header">ĐỊA CHỈ EMAIL</div>
                    <input name="email" type="email" placeholder="Jon@email" className="input_style"></input>
                </div>

                <div className="main_info_wrapper">
                    <div className="info_header">NGÀY SINH</div>
                    <input name="dob" type="date" placeholder="24/08/2005" className="input_style"></input>
                </div>

                <div className="main_info_wrapper">
                    <p className="info_header hover:cursor-pointer hover:text-blue-700" onClick={() => showPopUp? setShowPopUp(false) : setShowPopUp(true)}>ĐỔI MẬT KHẨU?</p>
                </div>


                <button className="button" type="submit">
                    <div className="font-bold text-white">Lưu thay đổi</div>
                </button>
            </form>

            
        </div>
    )
}

export default SideBar;
