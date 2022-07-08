import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";






export default function Carosel() {

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    cssEase: "linear"
  };


  return (
    <div className='border-2 w-[100%] block h-[40vh] relative'>
      <Slider {...settings}>
        <div className='h-[full] max-w-full w-full'>
          <img src="/assets/bg4-slider.jpg" alt="slider-img"
            className='object-cover w-full max-w-full'
          />
          <div className="content absolute h-[100%] w-[40%] top-0 right-0 bottom-0 bg-black">
              
          </div>
        </div>
        <div className='max-w-full w-full'>
          <img src="/assets/bg5-slider.jpg" alt="slider-img"
            className='object-cover w-full max-w-full'
          />
        </div>
      </Slider>
    </div>
  )
}
