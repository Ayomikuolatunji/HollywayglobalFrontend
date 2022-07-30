import React, { useEffect } from "react";
import MUIDataTable from "mui-datatables";


import ProductHeader from "./components/ProductHeader";
import ProductTable from "./components/ProductTable";




export default function AdminDashboard() {
  return (
    <div className="my-10 w-[95%] mx-auto">
      {/* header */}
      <ProductHeader />
      {/* table */}
      <ProductTable />
    </div>
  );
}
