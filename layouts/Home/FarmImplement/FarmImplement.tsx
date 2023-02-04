import React from "react";
import { AiOutlineShoppingCart, AiOutlineHeart } from "react-icons/ai";

interface Props {
  imageUrl: string;
  productName: string;
  price: string;
  promo?: string;
}

const products = [
  {
    imageUrl: "https://via.placeholder.com/500x500?text=Product+Image+1",
    productName: "Product 1",
    price: "$100",
    promo: "New",
  },
  {
    imageUrl: "https://via.placeholder.com/500x500?text=Product+Image+2",
    productName: "Product 2",
    price: "$200",
  },
  {
    imageUrl: "https://via.placeholder.com/500x500?text=Product+Image+3",
    productName: "Product 3",
    price: "$300",
    promo: "Sale",
  },
];

const ProductCard = (props: Props) => {
  return (
    <div className="flex flex-col items-center m-4 p-4 shadow-lg bg-white rounded-lg">
      <img
        className="w-48 h-48 object-cover"
        src={props.imageUrl}
        alt={props.productName}
      />
      <h4 className="mt-4 text-xl font-medium">{props.productName}</h4>
      <p className="text-gray-600 mt-2">${props.price}</p>
      {props.promo && (
        <span className="bg-indigo-500 text-white px-2 py-1 rounded-full text-xs">
          {props.promo}
        </span>
      )}
      <div className="flex mt-4">
        <AiOutlineShoppingCart className="text-indigo-500 mr-4 cursor-pointer" />
        <AiOutlineHeart className="text-indigo-500 cursor-pointer" />
      </div>
    </div>
  );
};

const FarmImplement = () => {
  return (
    <div className="flex flex-wrap justify-center">
      {products.map((product, index) => (
        <ProductCard key={index} {...product} />
      ))}
    </div>
  );
};

export default FarmImplement;
