import React, { useEffect } from "react";
import {
  useRowSelect,
  useTable,
  useFilters,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import { matchSorter } from "match-sorter";
import Row from "./Row";
import GlobalFilter from "../search/GlobalSearch";
import { DeleteActiveIcon, MoveInactiveIcon } from "../../helpers/Icons";
import { selectedTypings } from "../../models/product";
import TablePagination from "./TablePagination";

interface Props {
  dataTable: any;
  columns: any;
  selectedRows: any;
  setSelectedRows: any;
  changeProductStatusFunc: (status: selectedTypings) => void;
  bulkyDelectFunc: (status: selectedTypings) => void;
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
// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}: any) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}
function fuzzyTextFilterFn(rows: any, id: string | number, filterValue: any) {
  return matchSorter(rows, filterValue, {
    keys: [(row: any) => row.values[id]],
  });
}

fuzzyTextFilterFn.autoRemove = (val: boolean) => !val;

export default function Table({
  columns,
  dataTable,
  setSelectedRows,
  selectedRows,
  changeProductStatusFunc,
  bulkyDelectFunc,
}: Props) {
  const [records, setRecords] = React.useState(dataTable);
  const filterTypes: any = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      text: (rows: any[], id: string | number, filterValue: any) => {
        return rows.filter((row: any) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const DefaultFilterForColumn: any = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    selectedFlatRows,
    page: rows,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: dataTable || [],
      initialState: { pageSize: 20 },
      filterTypes,
      defaultColumn: DefaultFilterForColumn,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
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
          disableSortBy: true,
          Filter: () => {
            return null;
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

  const moveRow = (dragIndex: number, hoverIndex: number) => {
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
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <span className="my-4 text-xl">
        No of products:
        <h3 className="text-sm inline font-extrabold text-black ml-1">
          {rows.length} of {dataTable.length}
        </h3>
      </span>
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
            <button
              className="deactive-btn flex items-center ml-3"
              onClick={() => bulkyDelectFunc(selectedRows)}
            >
              <DeleteActiveIcon className="mr-2 h-5 w-5" aria-hidden="true" />
              <span className="text-sm font-semibold">Bulky delete</span>
            </button>
          </div>
        </div>
      )}
      <table
        {...getTableProps()}
        className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border-2 relative"
      >
        <thead className="text-xs text-gray-700 uppercase bg-white dark:bg-gray-700 dark:text-gray-400 border-b-2 border-t-2 border-t-gray-50">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {
                return (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="p-[12px]"
                  >
                    {column.render("Header")}
                    {/* Render the columns filter UI filtered */}
                    {column.render("Filter")}
                    <span className="inline">
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : " "}
                    </span>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        {dataTable?.length > 0 ? (
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
        ) : (
          <div className="absolute text-center  w-full p-5">
            <h1>Your car product lists is currently</h1>
          </div>
        )}
      </table>
      <TablePagination
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        pageOptions={pageOptions}
        pageCount={pageCount}
        gotoPage={gotoPage}
        nextPage={nextPage}
        previousPage={previousPage}
        setPageSize={setPageSize}
        pageSize={pageSize}
        pageIndex={pageIndex}
      />
    </DndProvider>
  );
}
