import React from "react";

const Header = () => {
  return (
    <header className="absolute left-0 w-full h-[30vh] md:h-[60vh] mb-8 top-[7vh] bg-[url(./assets/header_banner.png)] bg-center bg-cover bg-no-repeat">
      <div className="h-full justify-center text-white flex items-center gap-4 mb-4 pr-[40vw]">
        <div className="mr-25 md:mr-50 lg:mr-90">
          <h1 className="text-6xl font-bold">BidZone</h1>
          <p className="text-xl mt-2">Trang chủ</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
