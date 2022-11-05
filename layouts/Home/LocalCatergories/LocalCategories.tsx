import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import { ProductCard, Skeleton, Tabs } from "../../../components";
import { useFetchAllProductsQuery } from "../../../redux/apis/unprotectedProducts";

export default function LocalCategories() {
  const [currentTab, setCurrentTab] = useState("Local products");
  const { isLoading, data, isFetching, error } =
    useFetchAllProductsQuery(currentTab);
  console.log(data);
  return (
    <div className="mt-12">
      <div className="title text-center my-10">
        <h1 className="text-[#1c1c1c] relative font-[700] text-[36px] after:absolute after:left-0 after:right-0 after:h-[4px] after:w-[100px] after:mx-auto after:my-0 after:bg-[#7fad39] after:bottom-[-25px]">
          Local Products
        </h1>
      </div>
      <Tabs
        Tabheaders={[
          "Popular products",
          "Fruits/Vegetables",
          "Poutry & Seafoods",
          "Tubers & Cereals",
        ]}
        setCurrentTab={setCurrentTab}
        tab={true}
        renderTabPanel={() => (
          <Tab.Panels className="my-4">
            {[1, 2, 3, 4].map((item) => (
              <Tab.Panel className="grid grid-cols-5 gap-x-3 gap-y-4">
                {isLoading || (isFetching && data === undefined)
                  ? [1, 2, 4, 5, 6, 7, 8, 9].map((item) => <Skeleton />)
                  : data?.product?.slice(0, 10).map((item) => {
                      return <ProductCard item={item} />;
                    })}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        )}
      />
    </div>
  );
}
