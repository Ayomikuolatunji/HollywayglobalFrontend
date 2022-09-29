import React from "react";
import { currencyOptions, productsDepartments } from "../../../../helpers/utils";
import * as helper from "../../../../helpers";

import { productFormTypings } from "../../../../models/form";

export default function ProductForm({
  onSubmit,
  handleChange,
  handleFileChange,
  handleProductAvailable,
  setIsOpen,
  initialValues,
  imageExist = false,
  imageUrl,
  imagePreview=false
}: productFormTypings) {
    console.log(imageUrl)
  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex flex-col w-[100%]">
        <div className="w-full flex justify-center">
          <input
            id="name"
            name="name"
            placeholder="Enter car name"
            onChange={(e) => handleChange(e)}
            value={initialValues.name}
            type="text"
            className="w-[98%] mx-auto border-2 border-gray-400 my-2 p-[5px]"
          />
        </div>
        <div className="w-full flex justify-center">
          <input
            id="price"
            name="price"
            placeholder="Enter car price"
            type="number"
            onChange={(e) => handleChange(e)}
            value={initialValues.price}
            className="w-[98%] mx-auto border-2 border-gray-400 my-2 p-[5px]"
          />
        </div>
        <div className="w-full flex justify-center">
          <textarea
            id="description"
            name="description"
            placeholder="Enter car description"
            value={initialValues.description}
            onChange={(e) => handleChange(e)}
            className="w-[98%] mx-auto border-2 border-gray-400 my-2 p-[5px]"
          />
        </div>
        {/* currency selection  */}
        <div className="w-full flex justify-center">
          <select
            name="currency"
            onChange={(e) => handleChange(e)}
            value={initialValues.currency}
            className="w-[98%] mx-auto border-2 border-gray-400 my-2 p-[5px]"
          >
            <option value="">select sales currency</option>
            {Object.values(currencyOptions)
              .slice(0, 3)
              .map((key) => {
                return (
                  <option value={key.symbol_native} key={key.symbol_native}>
                    {key.symbol_native}
                  </option>
                );
              })}
          </select>
        </div>
        <div className="w-full flex justify-center">
          <input
            id="image"
            name="image"
            type="file"
            onChange={(e) => handleFileChange(e)}
            placeholder="product image"
            className="w-[98%] mx-auto border-2 border-gray-400 my-2 p-[5px]"
          />
        </div>
        {/* display image if it exist on product edit */}
          {imageExist && (
            <div className="w-full flex justify-center">
              <img
                src={imagePreview ? imageUrl : `http://localhost:8080/${imageUrl}`}
                alt="uploaded-img"
                width={300}
                height={100}
                className="border-2 border-blue-500"
              />
            </div>
          )}
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
        <div className="w-full flex justify-center">
          <select
            name="type"
            id="type"
            onChange={(e) => handleChange(e)}
            value={initialValues.type}
            className="w-[98%] mx-auto border-2 border-gray-400 my-2 p-[5px]"
          >
            <option value="">Select Car Type</option>
            {productsDepartments
              .map((option, index) => (
                <option value={option.name} key={index}>
                  {option.name}
                </option>
              ))}
          </select>
        </div>
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
  );
}
