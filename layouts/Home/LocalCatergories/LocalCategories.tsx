import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import {
  ProductCard,
  ProductCardSkeleton,
  Tabs,
} from "../../../components";
import { useFetchAllProductsQuery } from "../../../redux/apis/unprotectedProducts";
import { productTypings } from "../../../models";

export default function LocalCategories() {
  const [currentTab, setCurrentTab] = useState("Popular Foods");
  const { isLoading, data, isFetching, error } = useFetchAllProductsQuery({
    query_name: currentTab,
  });

  return (
    <div className="mt-12">
      <div className="relative">
        <h1
          className={`text-[#1c1c1c] relative font-[700] text-[26px] after:absolute after:left-0 after:right-0 after:h-[4px] after:w-[210px] after:mx-auto after:my-0 after:bg-main-deep-color after:bottom-[-3px] text-center p-4`}
        >
          Local Categories
        </h1>
        <hr className="h-5" />
      </div>
      {/* <Tabs
        TabHeaders={[
          "Fruits/Vegetables",
          "Livestocks/Sea foods",
          "Tubers/Cereals",
        ]}
        setCurrentTab={setCurrentTab}
        renderTabPanel={() => (
          <Tab.Panels className="mt-8 mb-4">
            {[1, 2, 3, 4].map((item) => (
              <Tab.Panel
                key={item}
                className="grid grid-cols-5 gap-x-3 gap-y-4"
              >
                {isLoading || (isFetching && data === undefined)
                  ? [1, 2, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
                      <ProductCardSkeleton key={index} />
                    ))
                  : data?.products?.slice(0, 10).map((item: productTypings) => {
                      return (
                        <ProductCard
                          item={item}
                          key={item._id}
                          currentTab={currentTab}
                        />
                      );
                    })}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        )}
      /> */}
    </div>
  );
}
