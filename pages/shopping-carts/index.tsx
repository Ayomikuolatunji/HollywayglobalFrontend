import Link from "next/link";
import React from "react";
import { useGetCartItemsQuery } from "../../redux/apis/usersApis";
import CartTable from "./components/CartTable";
// import Coupon from "./components/Coupon";
import Summary from "./components/Summary";

export default function Index() {
  const { data } = useGetCartItemsQuery() || {};

  return (
    <div className="xl:max-w-[1270px] mx-auto">
      <div className="container p-4 mx-auto mt-8">
        <div className="w-full overflow-x-auto">
          <div className="my-2">
            <h3 className="text-xl font-bold tracking-wider">
              Shopping Cart {data?.cartItems.length} items
            </h3>
          </div>
          {data?.cartItems.length! ? (
            <CartTable data={data} />
          ) : (
            <div>
              <h1>Cart lists currently empty</h1>
              <Link href="/">
                <div className="mt-6 cursor-pointer">Go Back</div>
              </Link>
            </div>
          )}
          {/* <Coupon /> */}
          {data?.cartItems.length! > 0 && (
            <div className="checkout-summary">
              <Summary data={data} />
              <div className="mt-4">
                <button className=" w-full py-2 text-center text-white bg-blue-500 rounded-md shadow hover:bg-blue-600">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
