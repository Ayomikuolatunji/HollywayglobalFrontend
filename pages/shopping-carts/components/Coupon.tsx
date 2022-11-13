import React from "react";

export default function Coupon() {
  return (
    <div className="lg:w-2/4">
      <div className="mt-4">
        <div className="px-4 py-4 rounded-md">
          <label htmlFor="coupon code" className="font-semibold text-gray-600">
            Coupon Code
          </label>
          <input
            type="text"
            placeholder="coupon code"
            value="LARA#234"
            className="
                w-full
                px-2
                py-2
                border border-blue-600
                rounded-md
                outline-none
              "
          />
          <span className="block text-green-600">
            Coupon code applied successfully
          </span>
          <button
            className="
                px-6
                py-2
                mt-2
                text-sm text-indigo-100
                bg-indigo-600
                rounded-md
                hover:bg-indigo-700
              "
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
