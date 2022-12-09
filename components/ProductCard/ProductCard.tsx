import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { FaShoppingCart } from "react-icons/fa";
import { ProductCardTypes } from "../../models/product";
import {
  unprotectedProductApis,
  useFetchPostDataMutation,
} from "../../redux/apis/unprotectedProducts";
import { useAddToCartItemMutation } from "../../redux/apis/usersApis";

interface extraTypes extends ProductCardTypes {
  currentTab?: string;
}

export default function ProductCard({ item, currentTab }: extraTypes) {
  const router = useRouter();
  const [addToCartItem] = useAddToCartItemMutation();
  const [fetchPostData] = useFetchPostDataMutation();

  const addToCartItemFunc = async (id: string) => {
    try {
      await addToCartItem(id)
        .unwrap()
        .then(async () => {
          unprotectedProductApis.util.resetApiState();
          unprotectedProductApis.util.invalidateTags(["ProductItems"]);
          if (currentTab) await fetchPostData(currentTab).unwrap();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const onViewProductDetails = () => {
    const routerPath = (router.query.productId = `/details-page/${item._id}`);
    router.push(routerPath);
  };

  return (
    <div>
      <div className="max-w-xs bg-white shadow-xl rounded-lg overflow-hidden cursor-pointer">
        <div className="px-4 py-2">
          <h6 className="text-gray-900 font-bold text-[16px] uppercase">
            {item.name}
          </h6>
          <p className="text-gray-600 text-sm mt-1">
            This product is available in bulk
          </p>
        </div>
        <span onClick={onViewProductDetails}>
          <img
            className="h-[160px] w-full object-cover mt-2"
            src={`http://localhost:8080/${item.image}`}
            alt="NIKE AIR"
          />
        </span>
        <div className="flex items-center justify-between px-4 py-2 bg-[#7fad39]">
          <h1 className="text-gray-200 font-bold text-xl">
            {item.currency}
            {item.price}
          </h1>
          <div className="text-sm text-gray-900 font-semibold rounded flex space-x-3 items-center">
            <AiFillHeart className="w-6 h-6 rounded-full bg-white p-1.5" />
            <FaShoppingCart
              className="w-6 h-6 rounded-full bg-white p-1.5"
              onClick={() => addToCartItemFunc(item._id!)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
