import { Tab } from "@headlessui/react";
import { useState } from "react";
import uuid from "react-uuid";

interface TabTypings {
  Tabheaders: string[];
  renderTabPanel: () => void | any;
  tab?: boolean;
  setCurrentTab: (value: any) => void;
}

const Tabs = ({
  Tabheaders,
  renderTabPanel,
  tab = true,
  setCurrentTab,
}: TabTypings) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
      <Tab.List className="flex justify-center mx-auto space-x-5">
        {Tabheaders.map((tabheader, index) => {
          if (selectedIndex === index) setCurrentTab(tabheader);
          return (
            <Tab
              key={uuid()}
              className={`text-xl ${
                selectedIndex === index ? "text-[#7fad39] font-extrabold" : ""
              }hover:border-0 active:border-0`}
            >
              {tabheader}
            </Tab>
          );
        })}
      </Tab.List>
      {tab && renderTabPanel()}
    </Tab.Group>
  );
};

export default Tabs;
