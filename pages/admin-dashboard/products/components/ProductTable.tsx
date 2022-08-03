import React from "react";
import MUIDataTable from "mui-datatables";

import * as helper from "../../../../helpers";


const columns = [
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

];

export default function ProductTable() {
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
