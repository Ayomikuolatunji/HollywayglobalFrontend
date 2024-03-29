import React from "react";
import {
  currencyOptions,
  productsDepartments,
} from "../../../../helpers/utils";

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
  imagePreview = false,
  submiting,
}: productFormTypings) {
  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex flex-col w-[100%]">
        <div className="w-full flex justify-center">
          <input
            id="name"
            name="name"
            placeholder="Product name"
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
            placeholder="Enter product price"
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
            placeholder="Enter product description"
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
            <option value="N">
              <span className="line-through">N</span>
            </option>
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
              src={
                imagePreview ? imageUrl : `http://localhost:8080/${imageUrl}`
              }
              alt="uploaded-img"
              width={300}
              height={100}
              className="border-2 border-blue-500"
            />
          </div>
        )}
        {/* is product available checkbox */}
        <div className="flex items-center w-[50%] pl-2">
          <label htmlFor="productAvailable">
            Is this product available?
          </label>
          <input
            id="productAvailable"
            name="productAvailable"
            type="checkbox"
            onChange={(e) => handleProductAvailable(e)}
            className="border-2 border-gray-400 my-2 ml-1 p-[5px]"
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
            <option value="">Select product department</option>
            {productsDepartments.map((option, index) => (
              <option value={option.name} key={index}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-[100%] flex justify-center  my-2 p-[5px]">
          <button
            onClick={() => setIsOpen(false)}
            className="text-main-color mx-3 font-extrabold"
          >
            Cancel
          </button>
          <button
            disabled={submiting}
            type="submit"
            className="py-[6px] px-[15px] mx-3 bg-main-color text-white"
          >
            {submiting ? "Submiting..." : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
}
