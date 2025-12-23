import React from "react";
import AdminNavBar from "../components/admin/AdminNavBar";
import CategoryDashboard from "../components/admin/CategoryDashboard";
import { useSearchParams } from "react-router-dom";

export const Admin = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "";

  return (
    <div className="flex rounded-xl border border-white h-fit w-full lg:h-155 -mt-10 overflow-hidden">
      <AdminNavBar />
      {tab == "Danh mục" && <CategoryDashboard />}
    </div>
  );
};
