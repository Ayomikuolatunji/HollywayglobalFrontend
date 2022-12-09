import { useRouter } from "next/router";
import React from "react";
import { DetailsPageSkeleton, RelatedProducts } from "../../components";
import DetailsContainer from "../../components/DetailPageComponents/DetailContainer";
import DetailsImg from "../../components/DetailPageComponents/DetailsImg";
import {
  useFetchAllProductsQuery,
  useSingleUserProductQuery,
} from "../../redux/apis/unprotectedProducts";

export default function ProductDetail() {
  const { query } = useRouter();
  const productId = query?.productId as string;
  const { data, isLoading } = useSingleUserProductQuery(productId);
  const relatedTypeString = data?.product?.type;
  const { data: RelatedProduct } = useFetchAllProductsQuery({
    query_name: relatedTypeString,
  });
  return (
    <div className="pt-[80px]">
      <div className="xl:max-w-[1270px] w-full mx-auto grid sm:grid-cols-2 px-[15px] gap-5">
        {data !== undefined ? (
          <>
            <DetailsImg product={data?.product} />
            <DetailsContainer product={data?.product} />
          </>
        ) : (
          <DetailsPageSkeleton />
        )}
        <RelatedProducts />
      </div>
    </div>
  );
}
