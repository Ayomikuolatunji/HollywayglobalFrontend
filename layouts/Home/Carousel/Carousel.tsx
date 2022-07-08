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
    autoplaySpeed: 2000,
    cssEase: "linear"
  };


  return (
    <div className='border-2 w-[100%] block relative h-[40vh]'>
        <Slider {...settings}>
          <div className='h-[50vh] max-w-full w-full'>
              <img src="/assets/bg4-slider.jpg" alt="slider-img" />
          </div>
          <div className='h-[50vh] max-w-full w-full'>
              <img src="/assets/bg5-slider.jpg" alt="slider-img" />
          </div>
        </Slider>
    </div>
  )
}
