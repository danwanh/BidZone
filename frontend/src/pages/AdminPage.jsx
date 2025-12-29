import React from "react";
import AdminNavBar from "../components/admin/AdminNavBar";
import CategoryDashboard from "../components/admin/category/CategoryDashboard";
import { useSearchParams } from "react-router-dom";
import UserList from "../components/admin/user/UserList";
import UpgradeList from "../components/admin/upgrade/UpgradeList";
import ProductList from "../components/admin/product/ProductList";
import VariableList from "../components/admin/variable/VariableList";

export const Admin = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "";

  return (
    <div className="flex rounded-xl border border-white h-fit w-full lg:h-155 -mt-5 overflow-hidden">
      <AdminNavBar />
      {tab === "Danh mục" && <CategoryDashboard />}
      {tab === "Người dùng" && <UserList />}
      {tab === "Nâng cấp" && <UpgradeList />}
      {tab === "Sản phẩm" && <ProductList />}
      {tab === "Biến toàn cục" && <VariableList />}
    </div>
  );
};
