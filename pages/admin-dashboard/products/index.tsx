import React, { useEffect } from "react";
import MUIDataTable from "mui-datatables";

import * as helper from "../../../helpers";

const columns = [
  {
    name: "first_name",
    label: "first_name",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "last_name",
    label: "last_name",
    options: {
      filter: true,
      sort: false,
    },
  },
  {
    name: "location",
    label: "location",
    options: {
      filter: true,
      sort: false,
    },
  },
  {
    name: "phone_number",
    label: "phone_number",
    options: {
      filter: true,
      sort: false,
    },
  },
  {
    name: "partner",
    label: "partner",
    options: {
      filter: true,
      sort: false,
    },
  },
  {
    name: "status",
    label: "status",
    options: {
      filter: true,
      sort: false,
    },
  },
  {
    name: "action",
    label: "action",
    options: {
      filter: true,
      sort: false,
    },
  },
];





const VerifyTable = () => {


const options = {
    filterType: 'checkbox',
};


  return (
    <div className="mt-10">
      <div className="relative overflow-x-auto shadow-xl">
      <MUIDataTable
        title={"Employee List"}
        data={helper.FakeProduct}
        columns={columns}
        options={options} 
        
    />
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  return (
    <div className="my-10 w-[95%] mx-auto">
      {/* header */}
      <VerifierHeader />
      {/* table */}
      <VerifyTable />
    </div>
  );
}
