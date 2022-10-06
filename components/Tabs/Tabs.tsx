import { Tab } from "@headlessui/react";

interface TabTypings {
  Tabheaders: string[];
  renderTabPanel: () => void | any;
  tab: boolean;
}

const Tabs = ({ Tabheaders, renderTabPanel, tab = false }: TabTypings) => {
  return (
    <Tab.Group>
      <Tab.List className="flex justify-center mx-auto space-x-5">
        {Tabheaders.map((tab) => {
          return <Tab>{tab}</Tab>;
        })}
      </Tab.List>
      {tab ? (
        renderTabPanel()
      ) : (
        <Tab.Panels>
          {" "}
        </Tab.Panels>
      )}
    </Tab.Group>
  );
};

export default Tabs;
