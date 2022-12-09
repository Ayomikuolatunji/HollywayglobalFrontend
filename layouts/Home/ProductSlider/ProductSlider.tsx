import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useFetchAllProductsQuery } from "../../../redux/apis/unprotectedProducts";
import { productTypings } from "../../../models/product";
import { ProductCardSkeleton } from "../../../components";
import { productApis } from "../../../redux/apis/AdminProductApi";

const ProductSlider: React.FC = () => {
  const { isLoading, data } = useFetchAllProductsQuery("all");
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    cssEase: "linear",
  };

  return (
    <div className="w-[100%] mx-auto mt-16 mb-10">
      <Slider {...settings}>
        {isLoading
          ? [1, 2, 3, 4].map((_, index) => {
              return <ProductCardSkeleton key={index} />;
            })
          : data?.product
              ?.slice(0, 8)
              .map((product: productTypings, index: number) => {
                return (
                  <div
                    key={index}
                    className="h-[200px] relative shadow-sm p-4 bg-gray-50 w-full"
                  >
                    <div
                      className={`wrapper relative ${
                        product.status ? "block" : "hidden"
                      }`}
                    >
                      <img
                        src={`http://localhost:8080/${product.image}`}
                        alt="img-products"
                        className="h-[180px] mt-[-5px] w-full"
                      />
                      <h3 className="text-[15px] text-[#7fad39] px-[16px] py-[12px] font-extrabold bg-[#fdfbfb] shadow-md absolute bottom-4 cursor-pointer">
                        {product.name}
                      </h3>
                    </div>
                  </div>
                );
              })}
      </Slider>
    </div>
  );
};

export default ProductSlider;
