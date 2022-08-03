import React, { useMemo } from "react";
import MUIDataTable from "mui-datatables";

import * as helper from "../../../../helpers";
import { useGetProductsQuery } from "../../../../redux/apis/productApi";



export default function ProductTable() {
  const {data}=useGetProductsQuery()
  console.log(data)
  const columns =useMemo(()=>{
     return  [
      {
        name: "produtId",
        label: "Product ID",
        options: {
          filter: true,
          sort: true,
        }
      },
      {
        name: "Car Name",
        label: "Car Name",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "Car Price",
        label: "Car Price",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "Type",
        label: "Type",
        options: {
          filter: true,
          sort: false,
        },
      },
    
    ]
  },[]);
  const options = {
    filterType: "checkbox",
    caseSensitive:false
  };

  return (
    <div className="mt-10">
      {/* <MUIDataTable
        title={"Products List"}
        data={helper.FakeProduct}
        columns={columns}
        options={options}
      /> */}
    </div>
  );
}
