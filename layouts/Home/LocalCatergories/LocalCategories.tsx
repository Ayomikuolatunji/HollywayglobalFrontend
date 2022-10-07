import React from "react";
import { Tab } from "@headlessui/react";
import { Tabs } from "../../../components";

export default function LocalCategories() {
  return (
    <div className="my-10">
      <div className="title text-center my-10">
        <h1 className="text-[#1c1c1c] relative font-[700] text-[26px] after:">
          Local Products
        </h1>
      </div>
      <Tabs
        Tabheaders={[
          "Popular Foods",
          "Fruit & Vegetables",
          "Poutry & Seafoods",
          "Tab 3",
        ]}
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
