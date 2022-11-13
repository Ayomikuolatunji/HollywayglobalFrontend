import React from "react";
import { useGetCartItemsQuery } from "../../redux/apis/usersApis";
import CartTable from "./components/CartTable";
// import Coupon from "./components/Coupon";
import Summary from "./components/Summary";

export default function index() {
  const { data } = useGetCartItemsQuery() || {};

  console.log(data);

  return (
    <div>
      <div className="container p-8 mx-auto mt-12">
        <div className="w-full overflow-x-auto">
          <div className="my-2">
            <h3 className="text-xl font-bold tracking-wider">
              Shopping Cart {data?.cartItems.length} items
            </h3>
          </div>
          {data && Object.keys(data!).length > 0 && <CartTable data={data} />}
          {/* <Coupon /> */}
          <Summary />
          <div className="mt-4">
            <button
              className="
            w-full
            py-2
            text-center text-white
            bg-blue-500
            rounded-md
            shadow
            hover:bg-blue-600
          "
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
