import React from "react";

export default function Skeleton() {
  return (
    <div className="max-w-sm p-4 m-10 mx-auto border border-gray-300 rounded-md shadow max-h-md">
      <div className="flex space-x-4 animate-pulse">
        <div className="flex-1 py-1 space-y-4">
          <div className="w-full h-40 bg-gray-400 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-400 rounded"></div>
            <div className="w-5/6 h-4 bg-gray-400 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
