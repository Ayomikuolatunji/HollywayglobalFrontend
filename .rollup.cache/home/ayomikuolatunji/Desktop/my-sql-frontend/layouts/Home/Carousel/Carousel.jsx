import React from "react";
import Slider from "react-slick";
import { IoCaretForwardSharp } from "react-icons/io5";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
export default function Carosel() {
    var settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 2000,
        cssEase: "linear",
    };
    return (<div className="border-2 w-[100%] block h-[40vh] max-w-full">
      <Slider {...settings}>
        <div className="h-[full] max-w-full w-full relative">
          <img src="/assets/bg4-slider.jpg" alt="slider-img" className="object-cover w-full max-w-full"/>
          <div className="absolute h-[inherent] w-[70%] top-0 right-0 bottom-0 text-white z-50 flex justify-center items-center">
            <div className="content-wrapper">
              <h1 className="text-[64px] uppercase font-[700]">Wheels</h1>
              <h2 className="text-[#ff8400] mt-9 
              text-[24px]">
                <span>Luxury, Racing, Forged</span>
              </h2>
              <div className="mt-10">
                <p className="text-[80px]">
                  29.<span className="text-[24px]">99$</span>
                </p>
              </div>
              <a href="#" className="bg-[#c41c1c] px-5 
              text-[14px] inline-block uppercase leading-[23px] text-[#fff] mt-5 py-1">
                Read more
                <IoCaretForwardSharp className="inline ml-3"/>
              </a>
            </div>
          </div>
        </div>
        <div className="h-[full] max-w-full w-full relative">
          <img src="/assets/bg5-slider.jpg" alt="slider-img" className="object-cover w-full max-w-full"/>
          <div className="absolute h-[inherent] w-[70%] top-0 right-0 bottom-0 text-white z-50 flex justify-center items-center">
            <div className="content-wrapper">
              <h1 className="text-[64px] uppercase font-[700]">Seat covers</h1>
              <h2 className="text-[#ff8400] mt-9 
              text-[24px]">
                <span>Leather, Velour, Neoprene</span>
              </h2>
              <div className="mt-10">
                <p className="text-[80px]">
                  50%<span className="text-[24px]">off</span>
                </p>
              </div>
              <a href="#" className="bg-[#c41c1c] px-5 
              text-[14px] inline-block uppercase leading-[23px] text-[#fff] mt-5 py-1">
                Read more
                <IoCaretForwardSharp className="inline ml-3"/>
              </a>
            </div>
          </div>
        </div>
      </Slider>
    </div>);
}
//# sourceMappingURL=Carousel.jsx.map