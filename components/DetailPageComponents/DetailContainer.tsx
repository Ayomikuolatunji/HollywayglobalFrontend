import React from "react";
import { BsStarFill } from "react-icons/bs";
import {
  AiOutlineHeart,
  AiOutlineTwitter,
  AiFillLinkedin,
  AiOutlineWhatsApp,
} from "react-icons/ai";
import { FaFacebookF } from "react-icons/fa";
import { DetailItemProps } from "../../models";

const DetailsContainer = ({ product }: DetailItemProps) => {
  return (
    <div>
      <h3 className="text-[#252525] font-[700] mb-[16px] text-[30px] leading-[36px] box-border font-[Cairo, sans-serif]">
        {product.name}
      </h3>
      <div className="product__details__rating flex items-center">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <BsStarFill
            key={index}
            className="mr-[-2px] text-[#EDBB0E] text-[1rem]"
          />
        ))}
        <span className="text-[#dd2222] font-normal text-[14px] ml-[4px]">
          (18 reviews)
        </span>
      </div>
      <div className="product__details__price font-[600] my-[15px] text-[20px] text-[#111010]">
        {product.currency}
        {product.price}
      </div>
      <p className="mb-[45px] text-[14px] leading-[26px] text-[#6f6f6f] font-[400]">
        {product.description}
      </p>
      <div className="flex items-center">
        <span className="detail-quantity-control flex items-center bg-[#eeebeb]">
          <span className="px-[23px] py-[18px] cursor-pointer">-</span>
          <span className="px-[20px] py-[16px]">
            <input
              type="text"
              value={1}
              className="w-3 text-center bg-none outline-none"
            />
          </span>
          <span className="px-[23px] py-[18px] cursor-pointer">+</span>
        </span>
        <span className="px-[28px] py-[16px] ml-3 bg-[#7fad39] text-white cursor-pointer">
          Add to cart
        </span>
        <span className="ml-3 px-[23px] py-[16px] bg-[#eeebeb] cursor-pointer">
          <AiOutlineHeart />
        </span>
      </div>
      <hr className="mt-[50px]" />
      <ul className="md:mt-10">
        <li className="grid grid-cols-2 md:mb-3">
          <div>
            <b className="font-[700] text-black text-[16px]">Availability</b>
          </div>
          <div className="">
            <span className="text-left">In Stock</span>
          </div>
        </li>
        <li className="grid grid-cols-2 md:mb-4">
          <div>
            <b className="font-[700] text-black text-[16px]">Shipping</b>
          </div>
          <div className="">
            <span className="text-left  text-[16px]">
              01 day shipping. Free pickup today
            </span>
          </div>
        </li>
        <li className="grid grid-cols-2 md:mb-4">
          <div>
            <b className="font-[700] text-black text-[16px]">Weight</b>
          </div>
          <div>
            <span>0.5 kg</span>
          </div>
        </li>
        <li className="grid grid-cols-2 md:mb-4">
          <div>
            <b className="font-[700] text-black text-[16px]">Share on</b>
          </div>
          <div className="icons flex space-x-5 border-r-2 border-r-gray-300 pr-6">
            <FaFacebookF className="text-black" />
            <AiOutlineTwitter className="text-black" />
            <AiFillLinkedin className="text-black" />
            <AiOutlineWhatsApp className="text-black" />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default DetailsContainer;
