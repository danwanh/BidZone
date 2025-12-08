import React from "react";

const Header = () => {
  return (
    <header className="absolute left-0 w-full h-[60vh] mb-8 top-[7vh] bg-[url(./assets/header_banner.png)] bg-center bg-cover bg-no-repeat">
      <div className="h-full justify-center text-white flex items-center gap-4 mb-4 pr-[40vw]">
        <div>
          <h1 className="text-5xl font-bold">BTCAuction</h1>
          <p className="text-lg mt-2">Home page</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
