import { Tab } from "@headlessui/react";
import { useState } from "react";

interface TabTypings {
  Tabheaders: string[];
  renderTabPanel: () => void | any;
  tab: boolean;
  setCurrentTab: (value: string) => void;
}

const Tabs = ({
  Tabheaders,
  renderTabPanel,
  tab = false,
  setCurrentTab,
}: TabTypings) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
      <Tab.List className="flex justify-center mx-auto space-x-5">
        {Tabheaders.map((tab, index) => {
          if (selectedIndex === index) setCurrentTab(tab);
          return (
            <Tab
              key={index}
              className={`text-xl ${
                selectedIndex === index ? "text-[#7fad39] font-extrabold" : ""
              }hover:border-0 active:border-0`}
            >
              {tab}
            </Tab>
          );
        })}
      </Tab.List>
      {tab ? renderTabPanel() : <Tab.Panels> {""} </Tab.Panels>}
    </Tab.Group>
  );
};

export default Tabs;
