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
            //   change cell.value equal to onsale text to red and bold
              return (
                <td
                  {...cell.getCellProps()}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 p-[12px]"
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
