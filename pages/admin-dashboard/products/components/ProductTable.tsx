import React from "react";
import MUIDataTable from "mui-datatables";

import * as helper from "../../../../helpers";
import { number } from "yup/lib/locale";

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

export default function ProductTable() {
  const options = {
    filterType: "checkbox",
    caseSensitive:false
  };

  return (
    <div className="mt-10">
      <MUIDataTable
        title={"Products List"}
        data={helper.FakeProduct}
        columns={columns}
        options={options}
      />
    </div>
  );
}
