import React from "react";
import Header from "../components/home/Header";
import ProductList from "../components/home/ProductList";

export const HomePage = () => {
  const titles = [
    "Top 5 sản phẩm gần kết thúc",
    "Top 5 sản phẩm có lượt ra giá nhiều nhất",
    "Top 5 sản phẩm có giá cao nhất",
  ];

  const urls = [
    "/api/product/top5/ending",
    "/api/product/top5/bid",
    "/api/product/top5/price",
  ];
  return (
    <>
      <Header />
      <section className="flex-col flex rounded-md px-10 py-10 bg-white md:col-span-3 space-y-6 mt-[60vh] min-h-[486px]">
        <ProductList
          title={titles[0]}
          baseURL={urls[0]}
          disablePagination={true}
        />
        <ProductList
          title={titles[1]}
          baseURL={urls[1]}
          disablePagination={true}
        />
        <ProductList
          title={titles[2]}
          baseURL={urls[2]}
          disablePagination={true}
        />
        <ProductList title={"Khám phá"} baseURL={"/api/product"} />
      </section>
    </>
  );
};
