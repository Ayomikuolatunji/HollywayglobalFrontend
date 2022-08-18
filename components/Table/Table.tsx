import React, { useEffect } from "react";
import {
  useRowSelect,
  useTable,
  useFilters,
  useGlobalFilter,
} from "react-table";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import Row from "./Row";
import GlobalFilter from "../search/GlobalSearch";
import { MoveInactiveIcon } from "../../helpers/Icons";

interface Props {
  dataTable: any;
  columns: any;
  selectedRows: any;
  setSelectedRows: any;
  changeProductStatusFunc: (status: any) => void;
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

export default function Table({
  columns,
  dataTable,
  setSelectedRows,
  selectedRows,
  changeProductStatusFunc,
}: Props) {
  const [records, setRecords] = React.useState(dataTable);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
    selectedFlatRows,
    state,

    //
  } = useTable(
    {
      columns,
      data: dataTable || [],
    },
    useFilters,
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          Header: (prop) => {
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
    setSelectedRows(selectedFlatRows);
  }, [selectedFlatRows]);

  const moveRow = (dragIndex: number, hoverIndex:number) => {
    const dragRecord = records[dragIndex];
    setRecords(
      update(records, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRecord],
        ],
      })
    );
  };


  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>
      {selectedRows.length > 0 && (
        <div className="flex justify-between items-center mb-3 ml-1">
          <div className="flex items-center">
            <span className="text-sm font-semibold">
              {selectedRows.length}{" "}
              {selectedRows.length === 1 ? "item" : "items"} selected
            </span>
            <button
              className="deactive-btn flex items-center ml-3"
              onClick={() => changeProductStatusFunc(selectedRows)}
            >
              <MoveInactiveIcon className="mr-2 h-5 w-5" />
              <span className="text-sm font-semibold">Change Status</span>
            </button>
          </div>
        </div>
      )}
      <table
        {...getTableProps()}
        className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border-2"
      >
        <thead className="text-xs text-gray-700 uppercase bg-white dark:bg-gray-700 dark:text-gray-400 border-b-2 border-t-2 border-t-gray-50">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className="p-[12px]">
                  {column.render("Header")}
                  {/* Render the columns filter UI */}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, index: number) => {
            prepareRow(row);
            return (
              <Row
                index={index}
                row={row}
                prepareRow={prepareRow}
                moveRow={moveRow}
                {...row.getRowProps()}
              />
            );
          })}
        </tbody>
      </table>
    </DndProvider>
  );
}

