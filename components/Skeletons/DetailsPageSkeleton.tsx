import React from "react";

export default function DetailsPageSkeleton() {
  return (
    <div className="xl:max-w-[1170px] max-h-full w-[100vw] h-[50vh] border-2  mx-auto mt-20">
      <div className="w-full mx-auto grid sm:grid-cols-2 px-[15px] gap-55">
        <div className="bg-gray-300 h-[100%]"></div>
        <div className="flex flex-col space-y-3">
          <div className="bg-gray-300 h-6 rounded-md "></div>
          <div className=" bg-gray-300 h-6 rounded-md "></div>
        </div>
      </div>
    </div>
  );
}
