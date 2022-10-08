import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import { ProductCard, Skeleton, Tabs } from "../../../components";
import { useFetchAllProductsQuery } from "../../../redux/apis/unprotectedProducts";


export default function LocalCategories() {
  const [currentTab, setCurrentTab] = useState("Local products");
  const { isLoading, data, isFetching } = useFetchAllProductsQuery(currentTab);
  return (
    <div className="mt-12">
      <div className="title text-center my-10">
        <h1 className="text-[#1c1c1c] relative font-[700] text-[36px] after:absolute after:left-0 after:right-0 after:h-[4px] after:w-[80px] after:mx-auto after:my-0 after:bg-[#7fad39] after:bottom-[-25px]">
          Local Products
        </h1>
      </div>
      <Tabs
        Tabheaders={[
          "Local products",
          "Fruits/Vegetables",
          "Poutry & Seafoods",
          "Tubers & Cereals",
        ]}
        setCurrentTab={setCurrentTab}
        tab={true}
        renderTabPanel={() => (
          <Tab.Panels className="my-4">
            {[1, 2, 3, 4].map((item) => (
              <Tab.Panel className="grid grid-cols-4 gap-3">
                {isLoading || isFetching
                  ? [1, 2, 4, 5, 5, 6, 7].map((item) => <Skeleton />)
                  : data?.product?.slice(0,8).map((item) => {
                      return <ProductCard item={item}/>;
                    })}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        )}
      />
    </div>
  );
}
