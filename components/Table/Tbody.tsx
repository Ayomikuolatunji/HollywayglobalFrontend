import React from "react";

export default function Tbody({ rows, getTableBodyProps, prepareRow }: any) {
  return (
    <tbody {...getTableBodyProps()}>
      {rows.map((row: any, i: number) => {
        prepareRow(row);
        return (
          <tr
            {...row.getRowProps()}
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
          >
            {row.cells.map((cell: any) => {
            //  if cell when status is true display green else red
              return (
                <td
                  {...cell.getCellProps()}
                  className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 p-[12px] font-bold ${cell.value === "Active" ? "text-green-500": cell.value=== "Inactive" ? "text-red-500" : ""}`}
                >
                  {cell.render("Cell")}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
}
