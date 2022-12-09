import { useRouter } from "next/router";
import React from "react";
import DetailsContainer from "../../components/DetailPageComponent/DetailContainer";
import DetailsImg from "../../components/DetailPageComponent/DetailsImg";
import { useSingleUserProductQuery } from "../../redux/apis/unprotectedProducts";

export default function ProductDetail() {
  const { query } = useRouter();
  const productId = query?.productId as string;
  const { data, isLoading } = useSingleUserProductQuery(productId);

  return (
    <div className="pt-[80px]">
      <div className="xl:max-w-[1170px] w-full mx-auto grid sm:grid-cols-2 px-[15px] gap-5">
        {data !== undefined && (
          <>
            <DetailsImg product={data?.product} />
            <DetailsContainer product={data?.product} />
          </>
        )}
      </div>
    </div>
  );
}
