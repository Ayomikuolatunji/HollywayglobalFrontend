import React, { useEffect } from "react";
import { useRowSelect, useTable } from "react-table";
import Tbody from "./Tbody";
import Thead from "./Thead";

interface Props {
  dataTable: any;
  columns: any;
  selectedRows:any, 
  setSelectedRows:any,
}

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }: any, ref: any) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;
    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);

export default function Table({ columns, dataTable,selectedRows, setSelectedRows, }: Props) {
  const {
    getTableProps,
    getTableBodyProps,
    rows,
    headerGroups,
    prepareRow,
    // get selected rows
    selectedFlatRows,
    state,
    // 
  } = useTable(
    {
      columns,
      data: dataTable || [],
    },
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          Header: (prop: any) => {
            return (
              <div>
                <IndeterminateCheckbox
                  {...prop.getToggleAllRowsSelectedProps()}
                />
              </div>
            );
          },
          accessor: "id",
          Cell: ({ row }: any) => {
            return (
              <input type="checkbox" {...row.getToggleRowSelectedProps()} />
            );
          },
        },
        ...columns,
      ]);
    }
  );



  useEffect(() => {
    setSelectedRows(selectedFlatRows)
  },[selectedFlatRows])

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
