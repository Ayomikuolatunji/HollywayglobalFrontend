import moment from "moment";
import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { productsDepartmentsTypes } from "../../../models/product";
import { useFetchDepartmentsQuery } from "../../../redux/apis/unprotectedProducts";
import AddDepartments from "./components/AddDepartmentsModal";

export default function Departments() {
  const [isOpen, setIsOpen] = useState(false);

  const { isLoading, data } = useFetchDepartmentsQuery();

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
      <div className="all-departments mt-7">
        <div className="overflow-x-auto relative">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Product name
                </th>
                <th scope="col" className="py-3 px-6">
                  Admin
                </th>
                <th scope="col" className="py-3 px-6">
                  No of Products
                </th>
                <th scope="col" className="py-3 px-6">
                  CreatedAt
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>Loading</tr>
              ) : (
                data?.departments.map((item: productsDepartmentsTypes) => {
                  return (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                         {item.name}
                      </th>
                      <td className="py-4 px-6">Admin Created</td>
                      <td className="py-4 px-6">100</td>
                      <td className="py-4 px-6">{moment(item.createdAt).format("MMMM Do YYYY")}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AddDepartments setIsOpen={setIsOpen} isOpen={isOpen} />
    </div>
  );
}
