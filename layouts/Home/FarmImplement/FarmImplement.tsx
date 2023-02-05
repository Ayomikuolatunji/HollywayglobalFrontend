import React from "react";
import Slider from "react-slick";
import { useFetchAllProductsQuery } from "../../../redux/apis/unprotectedProducts";
import { ProductCard } from "../../../components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const FarmImplement = () => {
  const { isLoading, data } = useFetchAllProductsQuery({
    query_name: "Farm Implements",
  });

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 3,
  };
  console.log(data);

  return (
    <div className=" my-24 relative">
      <div className="relative">
        <h1
          className={`text-[#1c1c1c] relative font-[700] text-[26px] after:absolute after:left-0 after:right-0 after:h-[4px] after:w-[210px] after:mx-auto after:my-0 after:bg-main-deep-color after:bottom-[-3px] text-center p-4`}
        >
          Farm Implements
        </h1>
        <hr className="h-5" />
      </div>
      {/* <ProductCard key={index} {...product} /> */}
      <Slider {...settings}>
        {data?.products?.map((product, index) => {
          return (
            <div key={index}>
              <ProductCard item={product} />
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default FarmImplement;
