import React, { useMemo } from "react";
import MUIDataTable from "mui-datatables";

import * as helper from "../../../../helpers";
import { useGetProductsQuery } from "../../../../redux/apis/productApi";



export default function ProductTable() {
  const {data,isFetching }=useGetProductsQuery()
  console.log(data)
  const columns =useMemo(()=>{
     return  [
      {
        column: "name",
        accessor: "name",
      },
      {
        column: "price",
        accessor: "price",
      },
      {
        column: "type",
        accessor: "type",
      },
    
    ]
  },[]);
  const options = {
    filterType: "checkbox",
    caseSensitive:false
  };

  return (
    <div className="mt-10">
      {isFetching?<div className="flex h-screen justify-center items-center">Loading...</div>: ""}
    </div>
  );
}
