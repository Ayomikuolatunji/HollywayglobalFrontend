import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useFetchAllProductsQuery } from "../../../redux/apis/unprotectedProducts";
import { productTypings } from "../../../models/product";
import { Skeleton } from "../../../components";
import { productApis } from "../../../redux/apis/productApi";

const ProductSlider: React.FC = () => {
  const { isLoading, data } = useFetchAllProductsQuery();
  const settings = {
    className:"mx-9",
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    cssEase: "linear",
  };

  return (
    <div className="w-[100%] mx-auto mt-20 mb-10">
      <Slider {...settings}>
        {data
          ? data?.product?.map((product: productTypings, index: number) => {
              return (
                <div
                  key={index}
                  className={`mx-3 h-[200px] relative hidden shadow-sm p-4 bg-gray-200 w-full`}
                >
                  <div className="wrapper relative">
                    <img
                      src={`http://localhost:8080/${product.image}`}
                      alt="img-products"
                      className="h-[180px] mt-[-5px] w-full"
                    />
                    <h3 className="text-[18px] text-[#1c1c1c] px-[16px] py-[12px]  bg-[#fff] absolute bottom-4">
                      {product.name}
                    </h3>
                  </div>
                </div>
              );
            })
          : [1, 3, 4, 5].map((data) => {
              return <Skeleton />;
            })}
      </Slider>
    </div>
  );
};

export default ProductSlider;
