import React, { useState } from "react";
import Slider from "react-slick";
import { useFetchAllProductsQuery } from "../../../redux/apis/unprotectedProducts";
import { ProductCard, ProductCardSkeleton, Tabs } from "../../../components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Tab } from "@headlessui/react";
import { productTypings } from "../../../models";

const FarmImplement = () => {
  const [currentTab, setCurrentTab] = useState("Farm Implements");
  const { isLoading, data, isFetching } = useFetchAllProductsQuery({
    query_name: currentTab,
  });

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
  };
  console.log(data);

  return (
    <div className=" my-24 relative">
      <div className="relative">
        <h1
          className={`text-[#1c1c1c] relative font-[700] text-[26px] after:absolute after:left-0 after:right-0 after:h-[4px] after:w-[210px] after:mx-auto after:my-0 after:bg-main-deep-color after:bottom-[-3px] text-center p-4`}
        >
          Farm Implements
        </h1>
        <hr className="h-5" />
      </div>
      <Tabs
        TabHeaders={["Farm Implements", "Irrigation Materials"]}
        setCurrentTab={setCurrentTab}
        renderTabPanel={() => (
          <Tab.Panels className="mt-8 mb-4">
            {[1, 2, 3, 4].map((item) => (
              <Tab.Panel key={item} className="">
                <Slider {...settings}>
                  {isLoading || (isFetching && data === undefined)
                    ? [1, 2, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
                        <ProductCardSkeleton key={index} />
                      ))
                    : data?.products.map((item: productTypings) => {
                        return (
                          <ProductCard
                            item={item}
                            key={item._id}
                            currentTab={currentTab}
                          />
                        );
                      })}
                </Slider>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        )}
      />
    </div>
  );
};

export default FarmImplement;
