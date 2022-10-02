import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductSlider: React.FC = () => {
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
    <div className="bg-white w-[97%] mx-auto mt-20 mb-10">
      <Slider {...settings}>
        <div>
          <div className="wrapper relative">
            <img src={"/img/product/product-1.jpg"} alt="img-products" />
            <h3 className="text-[18px] text-[#1c1c1c] px-[16px] py-[12px]  bg-[#fff] absolute bottom-4 left-[22%]">
              Fresh Meat
            </h3>
          </div>
        </div>
        <div>
          <div className="wrapper relative">
            <img src={"/img/product/product-6.jpg"} alt="img-products" />
            <h3 className="text-[18px] text-[#1c1c1c] px-[16px] py-[12px]  bg-[#fff] absolute bottom-4 left-[22%]">
              Fresh Meat
            </h3>
          </div>
        </div>
        <div>
          <div className="wrapper relative">
            <img src={"/img/product/product-3.jpg"} alt="img-products" />
            <h3 className="text-[18px] text-[#1c1c1c] px-[16px] py-[12px]  bg-[#fff] absolute bottom-4 left-[22%]">
              Fresh Meat
            </h3>
          </div>
        </div>
        <div>
          <div className="wrapper relative">
            <img src={"/img/product/product-2.jpg"} alt="img-products" />
            <h3 className="text-[18px] text-[#1c1c1c] px-[16px] py-[12px]  bg-[#fff] absolute bottom-4 left-[22%]">
              Fresh Meat
            </h3>
          </div>
        </div>
        <div>
          <div className="wrapper relative">
            <img src={"/img/product/product-4.jpg"} alt="img-products" />
            <h3 className="text-[18px] text-[#1c1c1c] px-[16px] py-[12px]  bg-[#fff] absolute bottom-4 left-[22%]">
              Fresh Meat
            </h3>
          </div>
        </div>
        <div>
          <div className="wrapper relative">
            <img src={"/img/product/product-5.jpg"} alt="img-products" />
            <h3 className="text-[18px] text-[#1c1c1c] px-[16px] py-[12px]  bg-[#fff] absolute bottom-4 left-[22%]">
              Fresh Meat
            </h3>
          </div>
        </div>
        <div>
          <div className="wrapper relative">
            <img src={"/img/product/product-5.jpg"} alt="img-products" />
            <h3 className="text-[18px] text-[#1c1c1c] px-[16px] py-[12px]  bg-[#fff] absolute bottom-4 left-[22%]">
              Fresh Meat
            </h3>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default ProductSlider;
