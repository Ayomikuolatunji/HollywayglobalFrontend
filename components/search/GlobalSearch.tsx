import { useAsyncDebounce } from "react-table";
import { useState } from "react";

// Define a default UI for filtering
interface FilterState {
  globalFilter: string;
  preGlobalFilteredRows?: any;
  setGlobalFilter: any;
}

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: any) {
  // const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value:any) => {
    setGlobalFilter(value || "");
  }, 200);

  return (
    <div className="mb-5 w-full">
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`search records...`}
         className="p-[6px] rounded-sm border-2 border-gray-400 w-[30%]"
      />
    </div>
  );
}
export default GlobalFilter;
