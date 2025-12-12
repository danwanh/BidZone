import React from "react";
import AdminNavBar from "../components/admin/AdminNavBar";
import { useSearchParams } from "react-router-dom";

export const Admin = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "";

  return (
    <div className="flex rounded-xl border border-white w-full h-145 -mt-10 overflow-hidden">
      <AdminNavBar />
      {tab == "Danh mục" && <div>a</div>}
    </div>
  );
};
