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
        name: "name",
        label: "name",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "price",
        label: "price",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "type",
        label: "type",
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
      {isFetching?<div className="flex h-screen justify-center items-center">Loading...</div>: ""}
    </div>
  );
}
