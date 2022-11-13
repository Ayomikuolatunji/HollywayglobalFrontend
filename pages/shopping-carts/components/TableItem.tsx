import React, { useState } from "react";
import { cartItemTypes } from "../../../models";
import {
  useDecrementCartItemsMutation,
  useDeleteCartItemMutation,
  useIncrementCartItemsMutation,
} from "../../../redux/apis/usersApis";

interface tableItemsTypes {
  cartItem: cartItemTypes;
}

export default function TableItem({ cartItem }: tableItemsTypes) {
  const [qty, setQty] = useState<number>(cartItem.productCount || 1);
  const [deleteCartItem] = useDeleteCartItemMutation();
  const [incrementCartItems] = useIncrementCartItemsMutation();
  const [decrementCartItems] = useDecrementCartItemsMutation();
  const handleQuality = (e: React.ChangeEvent<HTMLInputElement>) => {};

  const decrementQty = () => {
    if (qty === 1 || qty < -1) return;
    else {
      setQty((prev) => prev - 1);
      decrementCartItemsFunc();
    }
  };
  const deleteCartItemFunc = async () => {
    try {
      const res = await deleteCartItem(cartItem._id).unwrap();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const incrementCartItemsFunc = async () => {
    try {
      const res = await incrementCartItems(cartItem.productId._id!).unwrap();
    } catch (error) {}
  };
  const decrementCartItemsFunc = async () => {
    try {
      const res = await decrementCartItems(cartItem.productId._id!).unwrap();
    } catch (error) {}
  };

  const incrementQty = () => {
    setQty((prev) => prev + 1);
    incrementCartItemsFunc();
  };

  return (
    <tr>
      <td>
        <div className="flex justify-center">
          <img
            src={`http://localhost:8080/${cartItem.productId.image}`}
            className="object-cover h-28 w-28 rounded-2xl"
            alt="image"
          />
        </div>
      </td>
      <td className="p-4 px-6 text-center whitespace-nowrap">
        {cartItem.productId.name}
      </td>
      <td className="p-4 px-6 text-center whitespace-nowrap">
        <div>
          <button onClick={decrementQty}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="inline-flex w-6 h-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <input
            type="text"
            name="qty"
            value={qty}
            onChange={(e) => handleQuality(e)}
            className="w-12 text-center bg-gray-100 outline-none"
          />
          <button onClick={incrementQty}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="inline-flex w-6 h-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </td>
      <td className="p-4 px-6 text-center whitespace-nowrap">
        {cartItem.productId.currency} {cartItem.totalAmount}
      </td>
      <td className="p-4 px-6 text-center whitespace-nowrap">
        <button onClick={deleteCartItemFunc}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </td>
    </tr>
  );
}
