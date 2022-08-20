import React from 'react'
import { currencyOptions } from "../../../../helpers/utils";
import * as helper from "../../../../helpers";

interface productFormTypings {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onProductAvailable: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleProductAvailable: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setIsOpen: (isOpen: boolean) => void;
    initialValues: {
        name: string;
        price: string;
        description: string;
        type: string;
        currency: string;
    },
    file: string;
    carStatus: boolean;
    currency: string;
    type: string;
}

export default function ProductForm({
    onSubmit,
    handleChange,
    onProductAvailable,
    handleFileChange,
    handleProductAvailable,
    setIsOpen,
    initialValues
}: productFormTypings) {
  return (
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
        <label htmlFor="productAvailable">
          Is car available available?
        </label>
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
            <option value={option.name} key={index}>
              {option.name}
            </option>
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
  )
}
