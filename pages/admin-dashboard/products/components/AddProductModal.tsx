import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { FaCarAlt } from "react-icons/fa";

import { modalConditions } from "../../../../models/modal";
import { productTypings } from "../../../../models/product";
import { usePostProductMutation } from "../../../../redux/apis/productApi";
import { currencyOptions } from "../../../../helpers/utils";
import * as helper from "../../../../helpers";

const AddProductModal = ({ isOpen, setIsOpen }: modalConditions) => {
  const [postProdcts] = usePostProductMutation();
  const [file, setFile] = useState("");
  const [carStatus, setCarStatus] = useState(false);
  const [initialValues, setInitialValues] = useState<productTypings>({
    adminId: "",
    name: "",
    price: "",
    description: "",
    type: "",
    currency: "",
  });

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleProductAvailable = (e: any) => {
    setCarStatus(e.target.checked);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (file) {
      const fileData = new FormData();
      fileData.append("file", file);
      fetch("http://localhost:8080/images", {
        method: "POST",
        body: fileData,
      })
        .then((res) => res.json())
        .then((data) => {
          postProdcts({
            ...initialValues,
            status:carStatus,
            image: data.imageUrl,
          })
            .unwrap()
            .then((data: any) => {
              if (data.message === "Product created successfully") {
                setIsOpen(false);
              }
            })
            .catch((err: any) => console.log(err));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleChange = (e: any) => {
    // for checkbox onchange event
    const { name, value } = e.target;
    setInitialValues({ ...initialValues, [name]: value });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="w-full h-[100vh] absolute top-0 right-0 left-0 bottom-0 flex justify-center items-center 
      bg-[rgba(0,0,0,0.5)] z-[999]"
    >
      <Dialog.Panel className="bg-white border flex justify-center flex-col items-center w-[30%] rounded-md">
        <Dialog.Title className="p-4 text-blue-500 font-extrabold flex items-center text-2xl">
          <FaCarAlt/>
          Add a New Car
        </Dialog.Title>
        <hr className="w-full" />
        <Dialog.Description className="flex justify-center items-center w-[100%]">
          <form onSubmit={onSubmit} className="w-full">
            <div className="flex flex-col w-[100%]">
              <input
                id="name"
                name="name"
                placeholder="Enter car name"
                onChange={(e) => handleChange(e)}
                value={initialValues.name}
                type="text"
                className="w-[90%] mx-auto border-2 border-gray-400 my-2 p-[5px]"
              />
              <input
                id="price"
                name="price"
                placeholder="Enter car price"
                type="number"
                onChange={(e) => handleChange(e)}
                value={initialValues.price}
                className="w-[90%] mx-auto border-2 border-gray-400 my-2 p-[5px]"
              />
              <textarea
                id="description"
                name="description"
                placeholder="Enter car description"
                value={initialValues.description}
                onChange={(e) => handleChange(e)}
                className="w-[90%] mx-auto border-2 border-gray-400 my-2 p-[5px]"
              />
              {/* currency selection  */}
              <select
                name="currency"
                onChange={(e) => handleChange(e)}
                value={initialValues.currency}
                className="w-[90%] mx-auto border-2 border-gray-400 my-2 p-[5px]"
              >
                <option value="">select sales currency</option>
                {Object.values(currencyOptions).slice(0,3).map((key) => {
                  return (
                    <option value={key.symbol_native} key={key.symbol_native}>
                      {key.symbol_native}
                    </option>
                  );
                })}
              </select>
              <input
                id="image"
                name="image"
                type="file"
                onChange={(e) => handleFileChange(e)}
                placeholder="product image"
                className="w-[90%] mx-auto border-2 border-gray-400 my-2 p-[5px]"
              />
              {/* is product available checkbox */}
              <div className="flex items-center w-[40%] mx-auto">
                <label htmlFor="productAvailable">Is car available available?</label>
                <input
                  id="productAvailable"
                  name="productAvailable"
                  type="checkbox"
                  onChange={(e) => handleProductAvailable(e)}
                  className="mx-auto border-2 border-gray-400 my-2 p-[5px]"
                />
              </div>
              <select
                name="type"
                id="type"
                onChange={(e) => handleChange(e)}
                value={initialValues.type}
                className="w-[90%] mx-auto border-2 border-gray-400 my-2 p-[5px]"
              >
                <option value="">Select Car Type</option>
                {helper.navItems
                  .slice(1, helper.navItems.length)
                  .map((option, index) => (
                    <option value={option.name} key={index}>{option.name}</option>
                  ))}
              </select>

              <div className="w-[50%] mx-auto my-2 p-[5px]">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-blue-500 mx-3 font-extrabold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-[6px] px-[15px] mx-3 bg-blue-500 text-white"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </Dialog.Description>
      </Dialog.Panel>
    </Dialog>
  );
};
export default AddProductModal;
