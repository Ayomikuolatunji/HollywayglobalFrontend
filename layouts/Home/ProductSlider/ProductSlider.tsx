import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useFetchAllProductsQuery } from "../../../redux/apis/unprotectedProducts";
import { productTypings } from "../../../models/product";
import { ProductCardSkeleton, ProductHeader } from "../../../components";
import { settings } from "../../../helpers/utils";
import { useRouter } from "next/router";
import { FiHeart, FiShoppingCart } from "react-icons/fi";

const ProductSlider: React.FC = () => {
  const { isLoading, data } = useFetchAllProductsQuery({ query_name: "all" });
  const router = useRouter();

  const onViewProductDetails = (item: productTypings) => {
    const routerPath = (router.query.productId = `/details-page/${item._id}`);
    router.push(routerPath);
  };

  return (
    <div className="w-[100%] mx-auto mt-32 mb-10">
      <ProductHeader title="Our Exports Products" width={300}/>
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
                    <div className="flex p-6 flex-col  bg-white rounded-lg shadow-lg w-full m-4">
                      <img
                        src={`http://localhost:8080/${product.image}`}
                        alt={product.name}
                        onClick={() => onViewProductDetails(product)}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="flex items-center flex-col">
                        <h1 className="text-gray-600 font-extrabold text-lg">
                          {product.name}
                        </h1>
                        <h2 className="text-gray-700 font-medium text-sm mt-1">
                          ${product.price}
                        </h2>
                        <div className="mt-4 flex items-center">
                          <FiHeart className="text-red-600 cursor-pointer mr-4" />
                          <FiShoppingCart className="text-gray-600 cursor-pointer" />
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

export default ProductSlider;
