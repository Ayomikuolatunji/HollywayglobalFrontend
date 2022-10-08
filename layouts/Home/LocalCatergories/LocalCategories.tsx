import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import { Tabs } from "../../../components";

export default function LocalCategories() {
  const [currentTab, setCurrentTab]=useState("")
  console.log(currentTab);
 


  return (
    <div className="mt-12">
      <div className="title text-center my-10">
        <h1 className="text-[#1c1c1c] relative font-[700] text-[36px] after:absolute after:left-0 after:right-0 after:h-[4px] after:w-[80px] after:mx-auto after:my-0 after:bg-[#7fad39] after:bottom-[-25px]">
          Local Products
        </h1>
      </div>
      <Tabs
        Tabheaders={[
          "Popular Foods",
          "Fruit & Vegetables",
          "Poutry & Seafoods",
          "Tubers & Cereals",
        ]}
        setCurrentTab={setCurrentTab}
        tab={true}
        renderTabPanel={() => (
          <Tab.Panels>
            <Tab.Panel>Content 1</Tab.Panel>
            <Tab.Panel>Content 2</Tab.Panel>
            <Tab.Panel>Content 3</Tab.Panel>
            <Tab.Panel>Content 4</Tab.Panel>
            <Tab.Panel>Content 5</Tab.Panel>
          </Tab.Panels>
        )}
      />
    </div>
  );
}
