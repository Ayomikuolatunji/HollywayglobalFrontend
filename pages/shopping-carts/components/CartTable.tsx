import React, { useState } from "react";
import { cartItemTypes, productsCarts } from "../../../models";
import TableItem from "./TableItem";

export default function CartTable({ data }: any) {
  const [qty, setQty] = useState<number>(1);

  const handleQuality = (e: React.ChangeEvent<HTMLInputElement>) => {};

  const incrementQty = () => {
    setQty((prev) => prev + 1);
  };
  const decrementQty = () => {
    if (qty === 1 || qty < -1) return;
    else setQty((prev) => prev - 1);
  };

  console.log(data);

  return (
    <table className="w-full shadow-inner">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-6 py-3 font-bold whitespace-nowrap">Image</th>
          <th className="px-6 py-3 font-bold whitespace-nowrap">Product</th>
          <th className="px-6 py-3 font-bold whitespace-nowrap">Qty</th>
          <th className="px-6 py-3 font-bold whitespace-nowrap">Price</th>
          <th className="px-6 py-3 font-bold whitespace-nowrap">Remove</th>
        </tr>
      </thead>
      <tbody>
        {data &&
          data.cartItems!.map((cartItem: cartItemTypes, index: number) => (
            <TableItem
              cartItem={cartItem}
              decrementQty={decrementQty}
              qty={qty}
              handleQuality={handleQuality}
              incrementQty={incrementQty}
            />
          ))}
      </tbody>
    </table>
  );
}
