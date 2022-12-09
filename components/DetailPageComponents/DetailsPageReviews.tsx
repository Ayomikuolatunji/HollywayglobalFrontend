import { Tab } from "@headlessui/react";
import { Fragment } from "react";

const tabListsTitles = ["Description", "Information", "Reviews"];

export default function DetailsPageReviews() {
  return (
    <div className="mt-24 mb-6 w-full relative">
      <Tab.Group manual>
        <Tab.List className="flex justify-center space-x-16 mb-8 before:w-[35%] before:absolute before:left-0 before:h-[1px] before:top-2.5 before:bg-[#ebebeb]  before:contents('')  after:w-[35%] after:absolute after:right-0 after:h-[1px] after:top-2.5 after:bg-[#ebebeb]  after:contents('')">
          {tabListsTitles.map((tab, index) => (
            <Tab as={Fragment} key={index}>
              {({ selected }) => (
                <h1
                  className={`${
                    selected ? " text-black text-[18px] outline-none font-extrabold" : "text-gray-500"
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
            <div>
              <h1 className="mb-[26px] font-[700] text-[#333333]">
                Product Description
              </h1>
              <p>
                Vestibulum ac diam sit amet quam vehicula elementum sed sit amet
                dui. Pellentesque in ipsum id orci porta dapibus. Proin eget
                tortor risus. Vivamus suscipit tortor eget felis porttitor
                volutpat. Vestibulum ac diam sit amet quam vehicula elementum
                sed sit amet dui. Donec rutrum congue leo eget malesuada.
                Vivamus suscipit tortor eget felis porttitor volutpat. Curabitur
                arcu erat, accumsan id imperdiet et, porttitor at sem. Praesent
                sapien massa, convallis a pellentesque nec, egestas non nisi.
                Vestibulum ac diam sit amet quam vehicula elementum sed sit amet
                dui. Vestibulum ante ipsum primis in faucibus orci luctus et
                ultrices posuere cubilia Curae; Donec velit neque, auctor sit
                amet aliquam vel, ullamcorper sit amet ligula. Proin eget tortor
                r
              </p>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div>
              <h1 className="mb-[26px] font-[700] text-[#333333]">
                Products Infomation
              </h1>
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde
                officia commodi eveniet rerum! Odit nulla veritatis dolores a
                corporis sint et reprehenderit? Eius, itaque omnis.
              </p>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div>
              <h1 className="mb-[26px] font-[700] text-[#333333]">
                Submit your review
              </h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel
                sint ullam recusandae perspiciatis dignissimos eaque impedit
                explicabo harum, possimus, placeat deserunt quo sequi quis
                doloremque. Maiores sequi voluptates vitae deserunt nam quasi
                ipsam omnis assumenda commodi in sint, similique excepturi
                incidunt provident sapiente nihil, dicta saepe. Sapiente magnam
                voluptate similique mollitia placeat, rem voluptates explicabo
                cupiditate commodi debitis, ducimus harum.
              </p>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
