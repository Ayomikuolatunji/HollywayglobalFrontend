import React, { useMemo, useState } from "react";
import moment from 'moment';
import Table from "../../../../components/Table/Table";

import {
  fetchProductTypings,
  productTypings,
} from "../../../../models/product";
import { useGetProductsQuery } from "../../../../redux/apis/productApi";

export default function ProductTable() {
  const { data, isFetching } = useGetProductsQuery();
  const getData = data as fetchProductTypings;
  const [selectedRows, setSelectedRows] = useState([]);

  const columns: any = useMemo(() => {
    return [
      {
        Header: "name",
        accessor: "name",
      },
      {
        Header: "price",
        accessor: "price",
      },
      {
        Header: "type",
        accessor: "type",
      },
      {
        Header: "onsales",
        accessor: "onsales",
      },
      {
        Header:"createdAt",
        accessor:"createdAt",
      },{
        Header:"updatedAt",
        accessor:"updatedAt",
      },
     //add delete and edit button
      {
        Header: "Action",
        Cell: (props: any) => {
          return (
            <div className="">
              <button
                onClick={() => {
                  console.log(props.row.original);
                }
                }
              >
                Edit
              </button>
            </div>
          );
        }
      }

    ];
  }, []);

  const dataTable = useMemo(() => {
    return getData?.products?.map((product: productTypings) => {
      return {
        id:product.id,
        name: product.name,
        price: product.price,
        type: product.type,
        onsales: product.productAvailable,
        createdAt: moment(product.createdAt).format("MMMM Do YYYY"),
        updatedAt: moment(product.updatedAt).format("MMMM Do YYYY"),
      };
    });
  }, [getData]);

  console.log(selectedRows);

  return (
    <div className="mt-10 ">
      {isFetching ? (
        <div className="flex h-screen justify-center items-center">
          Loading...
        </div>
      ) : dataTable && dataTable.length > 0 ? (
        <Table columns={columns} dataTable={dataTable} 
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        />
      ): (
        <div className="flex justify-center items-center w-full border-2">
          Your products lists is empty
        </div>
      )}
    </div>
  );
}
