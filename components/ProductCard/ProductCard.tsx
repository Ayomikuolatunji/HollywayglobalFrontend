import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiOutlineShoppingCart, AiOutlineHeart } from "react-icons/ai";
import { BsHeart } from "react-icons/bs";
import { GiShoppingCart } from "react-icons/gi";
import { toast } from "react-toastify";
import { Error } from "../../models";
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
  const [wishlistHovered, setWishlistHovered] = useState(false);
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
          toast.success("Product added to cart", {
            toastId: "addToCartItemFunc-success-toast-id",
          });
        });
    } catch (error) {
      const err = error as Error;
      toast.error(err.data.message, {
        toastId: "addToCartItemFunc-error-toast-id",
      });
      console.log(error);
    }
  };

  const onViewProductDetails = () => {
    const routerPath = (router.query.productId = `/details-page/${item._id}`);
    router.push(routerPath);
  };

  return (
    <div className="flex flex-col items-center m-4 p-4 shadow-lg bg-white rounded-lg">
      <img
        className="w-48 h-48 object-cover"
        src={`http://localhost:8080/${item.image}`}
        onClick={onViewProductDetails}
        alt={item.name}
      />
      <div className="content mt-10 flex flex-col justify-center items-center">
        <h4 className="mt-4 text-xl font-medium">{item.name}</h4>
        <p className="text-gray-600 mt-2">${item.price}</p>
        <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
          In stock
        </span>
        <div className="mt-4 w-full flex items-center justify-center">
          <span>
            {wishlistHovered ? (
              <span>Added to Wishlist</span>
            ) : (
              <BsHeart className="text-2xl mr-5 text-main-color cursor-pointer font-extrabold" />
            )}
          </span>
          <button className="flex items-center justify-center bg-main-color hover:bg-main-deep-color p-2 rounded-md cursor-pointer transition duration-150">
            <GiShoppingCart className="text-white mr-2" />
            <span className="text-white font-medium">Add to cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
