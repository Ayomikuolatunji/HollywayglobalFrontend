import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";


import ProductHeader from "./components/ProductHeader";
import ProductTable from "./components/ProductTable";




export default function AdminDashboard() {
  const [isOpen, setIsOpen]=useState(false)



  return (
    <div className="my-10 w-[95%] mx-auto">
      {/* header */}
      <ProductHeader />
      {/* table */}
      <ProductTable />
    </div>
  );
}
