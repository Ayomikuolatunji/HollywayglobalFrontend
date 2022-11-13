import React, { useState } from "react";
import { cartItemTypes, productsCarts } from "../../../models";
import TableItem from "./TableItem";

export default function CartTable({ data }: any) {

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
          data.cartItems!.map((cartItem: cartItemTypes) => (
            <TableItem key={cartItem._id} cartItem={cartItem} />
          ))}
      </tbody>
    </table>
  );
}
