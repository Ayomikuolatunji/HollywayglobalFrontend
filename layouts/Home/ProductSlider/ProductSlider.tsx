import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductSlider: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
  };

  return (
    <div className="bg-white  w-[70%] mx-auto mt-20">
      <Slider {...settings}>
        <div>
          <div className="wrapper">
            <img src={"/img/product/product-1.jpg"} alt="img-products" />
            <h3>Product</h3>
          </div>
        </div>
        <div>
          <div className="wrapper">
            <img src={"/img/product/product-1.jpg"} alt="img-products" />
            <h3>Product</h3>
          </div>
        </div>
        <div>
        <div className="wrapper">
            <img src={"/img/product/product-1.jpg"} alt="img-products" />
          </div>
        </div>
        <div>
        <div className="wrapper">
            <img src={"/img/product/product-1.jpg"} alt="img-products" />
          </div>
        </div>
        <div>
        <div className="wrapper">
            <img src={"/img/product/product-1.jpg"} alt="img-products" />
          </div>
        </div>
        <div>
        <div className="wrapper">
            <img src={"/img/product/product-1.jpg"} alt="img-products" />
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default ProductSlider;
