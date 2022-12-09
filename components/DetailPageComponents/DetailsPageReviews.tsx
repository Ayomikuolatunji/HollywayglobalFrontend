import { Tab } from "@headlessui/react";

export default function DetailsPageReviews() {
  return (
    <div className="mt-24 mb-6 w-full">
      <Tab.Group manual>
        <Tab.List className="flex justify-center space-x-6">
          <Tab>Description</Tab>
          <Tab>Information</Tab>
          <Tab>Reviews</Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div>
              <h1 className="mb-[26px] font-[700] text-[#333333]">
                Product Descrip
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
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eos
                molestiae libero sint ab iste obcaecati quis laboriosam. Maiores
                ab perspiciatis iure? Qui laborum cum mollitia dicta incidunt
                quis explicabo delectus?
              </p>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
