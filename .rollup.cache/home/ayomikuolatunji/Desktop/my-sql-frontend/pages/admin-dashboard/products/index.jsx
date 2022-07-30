import React, { useState } from "react";
import ProductHeader from "./components/ProductHeader";
import ProductTable from "./components/ProductTable";
export default function AdminDashboard() {
    var _a = useState(false), isOpen = _a[0], setIsOpen = _a[1];
    return (<div className="my-10 w-[95%] mx-auto">
      {/* header */}
      <ProductHeader />
      {/* table */}
      <ProductTable />
    </div>);
}
//# sourceMappingURL=index.jsx.map