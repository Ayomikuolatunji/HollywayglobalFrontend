import React from "react";

export default function Summary({ data }: any) {
  return (
    <div className="mt-4">
      <div className="py-4 rounded-md shadow">
        <h3 className="text-xl font-bold text-blue-600">Order Summary</h3>
        <div className="flex justify-between px-4">
          <span className="font-bold">Subtotal</span>
          <span className="font-bold">$35.25</span>
        </div>
        <div className="flex justify-between px-4">
          <span className="font-bold">Discount</span>
          <span className="font-bold text-red-600">- $5.00</span>
        </div>
        <div className="flex justify-between px-4">
          <span className="font-bold">Sales Tax</span>
          <span className="font-bold">$2.25</span>
        </div>
        <div
          className="
      flex
      items-center
      justify-between
      px-4
      py-2
      mt-3
      border-t-2
    "
        >
          <span className="text-xl font-bold">Total</span>
          <span className="text-2xl font-bold">{data.totalAmounts}</span>
        </div>
      </div>
    </div>
  );
}
