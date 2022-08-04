import React, { useMemo } from "react";
import { useTable } from "react-table";

import * as helper from "../../../../helpers";
import {
  fetchProductTypings,
  productColumns,
  productTypings,
} from "../../../../models/product";
import { useGetProductsQuery } from "../../../../redux/apis/productApi";

export default function ProductTable() {
  const { data, isFetching } = useGetProductsQuery();
  const getData = data as unknown as fetchProductTypings;

  const columns:any= useMemo(() => {
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
    ];
  }, []);

  const dataTable = useMemo(() => {
    return getData?.products?.map((product: productTypings) => {
      return {
        name: product.name,
        price: product.price,
        type: product.type,
        onsales: product.productAvailable,
      };
    });
  }, [getData]);

  const { getTableProps, getTableBodyProps, rows, headerGroups, prepareRow } =
    useTable({
      columns,
      data: dataTable || [],
    });

  return (
    <div className="mt-10">
      {isFetching ? (
        <div className="flex h-screen justify-center items-center">
          Loading...
        </div>
      ) : (
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
