import React from "react";
import {
  DetailItemProps,
  productTypings,
  RelatedProductsProps,
} from "../../models";
import ProductCard from "../ProductCard/ProductCard";
import ProductCardSkeleton from "../Skeletons/ProductCardSkeleton";

export default function RelatedProducts({
  relatedProducts,
  isRelatedProductsLoading,
  isRelatedProductFetching,
  currentProductId,
}: RelatedProductsProps) {
  return (
    <div className="my-24">
      <div className="title text-center my-10">
        <h1 className="text-[#1c1c1c] relative font-[700] text-[26px] after:absolute after:left-0 after:right-0 after:h-[4px] after:w-[100px] after:mx-auto after:my-0 after:bg-[#7fad39] after:bottom-[-25px]">
          Related Products
        </h1>
      </div>
      <div className="grid grid-cols-5 gap-x-3 gap-y-4">
        {isRelatedProductsLoading ||
        (isRelatedProductFetching && relatedProducts === undefined)
          ? [1, 2, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          : relatedProducts?.products
              .filter(({ _id }) => _id !== currentProductId)
              ?.slice(0, 5)
              .map((item: productTypings) => {
                return <ProductCard item={item} />;
              })}
      </div>
    </div>
  );
}
