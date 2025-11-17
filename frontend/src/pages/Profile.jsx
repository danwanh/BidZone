import React from "react";
import ProductCard  from "../components/profile/ProductCard";
import SideBar from "../components/profile/SideBar";

export const ProfilePage = () => {
    return(
        <>
            <div className="bg-[linear-gradient(46deg,#A9B9F8,#667ACA)] px-[6%] py-20 flex gap-[30px] w-full">
                <div className="w-1/3">
                    <SideBar />
                </div>

                <div className="flex-1">
                    <ProductCard />
                </div>
            </div>
        </>
    )
}