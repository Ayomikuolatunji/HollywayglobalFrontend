import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  useFetchAllProductsQuery,
  useFetchPostDataMutation,
} from "../../../redux/apis/unprotectedProducts";
import { productTypings } from "../../../models/product";
import { ProductCardSkeleton, ProductHeader } from "../../../components";
import { settings } from "../../../helpers/utils";
import { useRouter } from "next/router";
import { BsHeart } from "react-icons/bs";
import { GiShoppingCart } from "react-icons/gi";
import { useAddToCartItemMutation } from "../../../redux/apis/usersApis";
import { localStorageGetItem } from "../../../helpers/Storage";
import { toast } from "react-toastify";
import { Error } from "../../../models";

const ExportProducts: React.FC = () => {
  const { isLoading, data } = useFetchAllProductsQuery({ query_name: "all" });
  const router = useRouter();
  const [wishlistHovered, setWishlistHovered] = useState(false);
  const [addToCartItem] = useAddToCartItemMutation();
  const [fetchPostData] = useFetchPostDataMutation();

  const addToCartItemFunc = async (item: productTypings) => {
    try {
      if (!localStorageGetItem("userId")) {
        toast.info("You have to login first", {
          toastId: "id-login-auth",
        });
        return;
      } else if (item?.item_in_cart) {
        return;
      }
      await addToCartItem(item?._id!)
        .unwrap()
        .then(async () => {});
    } catch (error) {
      const err = error as Error;
      toast.error(err.data.message, {
        toastId: "addToCartItemFunc-error-toast-id",
      });
      console.log(error);
    }
  };

  const onViewProductDetails = (item: productTypings) => {
    const routerPath = (router.query.productId = `/details-page/${item._id}`);
    router.push(routerPath);
  };

  return (
    <div className="w-[100%] mx-auto mt-32 mb-10">
      <ProductHeader title="Our Exports Products" width="29px" />
      <Slider {...settings}>
        {isLoading
          ? [1, 2, 3, 4].map((_, index) => {
              return <ProductCardSkeleton key={index} />;
            })
          : data?.products
              ?.slice(0, 10)
              .map((product: productTypings, index: number) => {
                return (
                  <div key={index}>
                    <div className="flex p-1 flex-col  bg-white rounded-lg shadow-lg w-full m-2">
                      <img
                        src={`http://localhost:8080/${product.image}`}
                        alt={product.name}
                        onClick={() => onViewProductDetails(product)}
                        className="w-full h-52 object-cover rounded-lg"
                      />
                      <div className="flex items-center flex-col mt-12 p-3">
                        <h1 className="text-gray-600 font-extrabold text-lg">
                          {product.name}
                        </h1>
                        <h2 className="text-gray-700 font-medium text-sm mt-1">
                          ${product.price}
                        </h2>
                        <h3 className="">
                          Seller:{" "}
                          <span className="text-main-color">
                            Hollywayglobal
                          </span>
                        </h3>
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
                            <span
                              className="text-white font-medium"
                              onClick={() => addToCartItemFunc(product)}
                            >
                              Add to cart
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
      </Slider>
    </div>
  );
};

export default ExportProducts;
