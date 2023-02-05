import { Tab } from "@headlessui/react";
import { Fragment } from "react";
import CustomerReviews from "./CustomerReviews";
import ProductInformation from "./ProductInformation";

const tabListsTitles = ["Reviews", "Information"];

export default function DetailsPageReviews() {
  return (
    <div className="mt-24 mb-6 w-full relative">
      <Tab.Group manual>
        <Tab.List className="flex justify-center space-x-16 mb-12 before:w-[35%] before:absolute before:left-0 before:h-[1px] before:top-2.5 before:bg-[#ebebeb]  before:contents('')  after:w-[35%] after:absolute after:right-0 after:h-[1px] after:top-2.5 after:bg-[#ebebeb]  after:contents('')">
          {tabListsTitles.map((tab, index) => (
            <Tab as={Fragment} key={index}>
              {({ selected }) => (
                <h1
                  className={`${
                    selected
                      ? " text-black text-[18px] outline-none font-extrabold"
                      : "text-gray-500"
                  } cursor-pointer hover:border-0`}
                >
                  {tab}
                </h1>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <CustomerReviews />
          </Tab.Panel>
          <Tab.Panel>
            <ProductInformation />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
