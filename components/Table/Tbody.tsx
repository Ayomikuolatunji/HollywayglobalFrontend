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
            {row.cells.map(
              (cell: {
                getCellProps: () => JSX.IntrinsicAttributes &
                  React.ClassAttributes<HTMLTableDataCellElement> &
                  React.TdHTMLAttributes<HTMLTableDataCellElement>;
                value: string;
                render: (
                  arg0: string
                ) =>
                  | string
                  | number
                  | boolean
                  | React.ReactElement<
                      any,
                      string | React.JSXElementConstructor<any>
                    >
                  | React.ReactFragment
                  | React.ReactPortal
                  | null
                  | undefined;
              }) => {
                //  if cell when status is true display green else red
                return (
                  <td
                    {...cell.getCellProps()}
                    className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 p-[12px] font-bold `}
                  >
                    {cell.render("Cell")}
                  </td>
                );
              }
            )}
          </tr>
        );
      })}
    </tbody>
  );
}
