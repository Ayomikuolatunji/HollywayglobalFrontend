import { useMemo } from "react"

// a unique option from a list
function SelectColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id },
  }:any) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options=useMemo(() => {
      const options:any= new Set()
      preFilteredRows.forEach((row:any)=> {
        options.add(row.values[id])
      })
      return [...options.values()]
    }, [id, preFilteredRows])
  
    // Render a multi-select box
    return (
      <select
        value={filterValue}
        onChange={e => {
          setFilter(e.target.value || undefined)
        }}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[50%] 
        p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="">All</option>
        {options.map((option:string, i:number) => (
          <option key={i} value={option} className="p-2">
            {option}
          </option>
        ))}
      </select>
    )
}

export default SelectColumnFilter