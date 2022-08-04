import React from 'react'

export default function Thead({
    headerGroups,
}:any) {
  return (
    <thead className="text-xs text-gray-700 uppercase bg-white dark:bg-gray-700 dark:text-gray-400 border-b-2 border-t-2 border-t-gray-50">
    {headerGroups.map((headerGroup:any) => (
      <tr {...headerGroup.getHeaderGroupProps()}>
        {headerGroup.headers.map((column:any) => (
          <th {...column.getHeaderProps()} className="p-[12px]">{column.render("Header")}</th>
        ))}
      </tr>
    ))}
  </thead>
  )
}
