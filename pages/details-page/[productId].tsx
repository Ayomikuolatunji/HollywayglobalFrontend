import { useRouter } from "next/router";
import React from "react";
import {
  DetailsPageSkeleton,
  RelatedProducts,
  DetailsContainer,
  DetailsImg,
  DetailsPageReviews,
} from "../../components";
import {
  useFetchAllProductsQuery,
  useSingleUserProductQuery,
} from "../../redux/apis/unprotectedProducts";

export default function ProductDetail() {
  const { query } = useRouter();
  const { data, isLoading } = useSingleUserProductQuery(
    query?.productId as string
  );

  const {
    data: relatedProducts,
    isLoading: isRelatedProductsLoading,
    isFetching: isRelatedProductFetching,
  } = useFetchAllProductsQuery({
    query_name: data?.product?.type as string,
  });

  return (
    <div className="pt-[80px] xl:max-w-[1270px] mx-auto">
      <div className="w-full mx-auto grid sm:grid-cols-2 px-[15px] gap-5">
        {data !== undefined && !isLoading ? (
          <>
            <DetailsImg product={data?.product} />
            <DetailsContainer product={data?.product} />
          </>
        ) : (
          <DetailsPageSkeleton />
        )}
      </div>
      <DetailsPageReviews />
      <div className="relatedProducts">
        <RelatedProducts
          currentProductId={data?.product?._id!}
          relatedProducts={relatedProducts!}
          isRelatedProductsLoading={isRelatedProductsLoading}
          isRelatedProductFetching={isRelatedProductFetching}
        />
      </div>
    </div>
  );
}
