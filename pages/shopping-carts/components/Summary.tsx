import React from "react";

export default function Summary() {
  return (
    <div className="mt-4">
      <div className="rounded-sm border-2 p-3">
        <h3 className="text-[22px] font-bold text-[#000000] my-3">
          Cart Summary
        </h3>
        <div className="flex justify-between mb-2">
          <span className="font-bold">Subtotal</span>
          <span className="font-bold">$35.25</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-bold">Discount</span>
          <span className="font-bold text-red-600">- $5.00</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Sales Tax</span>
          <span className="font-bold">$2.25</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-xl text-[#000000 font-bold">Total</span>
        </div>
      </div>
    </div>
  );
}
