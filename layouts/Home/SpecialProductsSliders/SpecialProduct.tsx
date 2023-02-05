import React, { Component, useEffect, useRef, useState } from "react";
import { productTypings } from "../../../models";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { useRouter } from "next/router";
interface internalDataItem {
  title: string;
  data: Array<productTypings>;
}

interface internalDataProps {
  product: internalDataItem;
}

export const SpecialProduct: React.FC<internalDataProps> = ({ product }) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex(
      currentIndex + 3 >= product.data.length ? 0 : currentIndex + 3
    );
  };

  const handlePrev = () => {
    setCurrentIndex(currentIndex - 3 < 0 ? currentIndex + 3 : currentIndex - 3);
  };

  const onViewProductDetails = (item: productTypings) => {
    const routerPath = (router.query.productId = `/details-page/${item._id}`);
    router.push(routerPath);
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-7">
        <h1 className="text-black font-extrabold text-xl">{product.title}</h1>
        <div className="button">
          <button
            onClick={handlePrev}
            type="button"
            className="border-2 rounded-md p-2 bg-[#F3F6FA]"
          >
            <GrFormPrevious />
          </button>
          <button
            onClick={handleNext}
            type="button"
            className="border-2 rounded-md p-2 ml-4 bg-[#F3F6FA]"
          >
            <GrFormNext />
          </button>
        </div>
      </div>
      <div
        className="flex flex-col"
        style={{ whiteSpace: "nowrap" }}
        ref={sliderRef}
      >
        {product.data
          .slice(currentIndex, currentIndex + 3)
          .map((item, index) => {
            return (
              <div
                key={index}
                className="flex items-center gap-5 mb-4 cursor-pointer"
              >
                <img
                  src={`http://localhost:8080/${item.image}`}
                  alt={item.name}
                  className="w-32 h-32"
                  onClick={() => onViewProductDetails(item)}
                />
                <div className="content">
                  <h1 className="text-gray-600 font-extrabold text-lg">
                    {item.name}
                  </h1>
                  <h3 className="font-extrabold text-black text-xl">
                    {item.price}
                  </h3>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
