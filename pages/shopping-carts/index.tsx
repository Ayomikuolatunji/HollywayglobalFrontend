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
            <div className="w-full flex">
              <div className="w-[80%]">
                <CartTable data={data} />
              </div>
              <div className="w-[20%]">
                <Summary />
              </div>
            </div>
          ) : (
            <span>Empty cart</span>
          )}
        </div>
      </div>
    </div>
  );
}
