import React from "react";

interface paginationTypings {
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageOptions: Array<number>;
  pageCount: number;
  gotoPage: (a: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (a: number) => void;
  pageIndex: number;
  pageSize: number;
}

const TablePagination = ({
  canPreviousPage,
  canNextPage,
  pageOptions,
  pageCount,
  gotoPage,
  nextPage,
  previousPage,
  setPageSize,
  pageIndex,
  pageSize,
}: paginationTypings) => {
  return (
    <div className="pagination my-4 flex justify-center items-center">
      <button
        onClick={() => gotoPage(0)}
        disabled={!canPreviousPage}
        className="block py-1 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        {"<<"}
      </button>
      <button
        onClick={() => gotoPage(pageCount - 1)}
        title="Go to nextpage"
        disabled={!canNextPage}
        className="mx-3 cursor-pointer py-1 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        {">>"}
      </button>
      <span>
        Page{" "}
        <strong>
          {pageIndex + 1} of {pageOptions.length}
        </strong>{" "}
      </span>
      <span>
        | Go to page:{" "}
        <input
          type="number"
          defaultValue={pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            gotoPage(page);
          }}
          className="border-2 w-16 p-0.5"
        />
      </span>{" "}
      <span className="mx-1">
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
          className="p-1 bg-none"
        >
          {[20, 30].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </span>
    </div>
  );
};

export default TablePagination;
