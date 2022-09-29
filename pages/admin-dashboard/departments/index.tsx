import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import AddDepartments from "./components/AddDepartmentsModal";

export default function Departments() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4">
      <div className="header">
        <div className="flex justify-end">
          {/* select dropwdown */}
          <div className="flex items-center">
            <div className="ml-5">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-medium  font-serif px-3 py-2 flex items-center"
                onClick={() => setIsOpen(true)}
              >
                <FiPlus className="text-2xl inline mr-2" />
                <span>Add New Products Deparments</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <AddDepartments setIsOpen={setIsOpen} isOpen={isOpen} />
    </div>
  );
}
