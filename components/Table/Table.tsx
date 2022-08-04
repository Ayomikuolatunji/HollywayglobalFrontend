import React from "react";
import { useRowSelect, useTable } from "react-table";
import { productTypings, productColumns } from "../../models/product";
import Tbody from "./Tbody";
import Thead from "./Thead";

interface Props {
  dataTable: any;
  columns: any;
}

export default function Table({ columns, dataTable }: Props) {
  const { getTableProps, getTableBodyProps, rows, headerGroups, prepareRow } =
    useTable({
      columns,
      data: dataTable || [],
    },useRowSelect,
    hooks=>{
        hooks.visibleColumns.push(columns=>{
            columns.push({
                id:"selection",
                Header:()=>null,
                accessor:"selection",
                Cell:(props:any)=>{
                    return <input type="checkbox" {...props.getToggleRowSelectedProps()} />
                }
            })
        })
    });

    // add id field to columns

  return (
    <table
      {...getTableProps()}
      className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border-2"
    >
      <Thead headerGroups={headerGroups} />
      <Tbody
        rows={rows}
        getTableBodyProps={getTableBodyProps}
        prepareRow={prepareRow}
      />
    </table>
  );
}
