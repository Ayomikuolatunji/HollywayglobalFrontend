import React, { useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
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



const VerifierHeader = () => {
  return (
    <div className="flex justify-between">
      {/* select dropwdown */}
      <div className="dropdown">
        <select
          name="account"
          className="px-3 border-2 border-gray-200 bg-white py-3 ml-"
        >
          <option value="">All</option>
          <option value="">Active Verifiers</option>
          <option value="">Pending Verifiers</option>
          <option value="">Deactivated Verifiers</option>
        </select>
      </div>
      <div className="flex items-center">
        <div className="search relative">
          <BsSearch className="text-[#c9c9c9] text-xl absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search products"
            className="w-full py-3 px-5 indent-8 border-2"
          />
        </div>
        <div className="ml-5">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-medium  font-serif px-3 py-3 flex items-center">
            <FiPlus className="text-2xl inline mr-2" />
            <span>New Product</span>
          </button>
        </div>
      </div>
    </div>
  );
};

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
