import React from "react";

export default function Tooltip({ content, text }: any) {
  return (
    <div className="group relative inline-block">
      {content && content()}
      <div className="absolute bottom-full left-1/2 z-20 mb-3 -translate-x-1/2 whitespace-nowrap rounded bg-black py-[6px] px-4 text-sm font-semibold text-white opacity-0 group-hover:opacity-100">
        <span className="absolute bottom-[-3px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm bg-black"></span>
        {text}
      </div>
    </div>
  );
}
