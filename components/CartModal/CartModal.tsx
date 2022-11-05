import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { modalConditions, ProductCardTypes } from "../../models";

const CartModal = ({
  setIsOpen,
  isOpen,
  item,
}: modalConditions & ProductCardTypes) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="w-full h-[100vh] fixed top-0 right-0 left-0 bottom-0 flex justify-center items-center 
    bg-[rgba(0,0,0,0.5)] z-[999]"
    >
      <Dialog.Panel className="bg-white border flex justify-center flex-col items-center w-[25%] rounded-md">
        <Dialog.Title className="p-4 text-gray-800 font-extrabold flex items-center text-2xl">
          Add product to cart
        </Dialog.Title>
        <Dialog.Description className="w-full p-4">
          <img
            className="h-[240px] w-full object-cover mt-2"
            src={`http://localhost:8080/${item.image}`}
            alt="NIKE AIR"
          />
          <div className="flex flex-col text-center mt-5">
            <h1 className="text-xl">Product name: {item.name}</h1>
            <h3>Price: {item.price}</h3>
          </div>
        </Dialog.Description>
        <div className="w-[100%] flex justify-center mx-auto my-2 p-[5px]">
          <button
            onClick={() => setIsOpen(false)}
            className="text-[#7fad39] border-2 border-[#7fad39] mx-3 font-extrabold px-2 py-3"
          >
            Continue Shopping
          </button>
          <button
            type="submit"
            className="py-[6px] px-[15px] mx-3 bg-[#7fad39] text-white"
          >
            View product Details
          </button>
        </div>
        <div className="view-carts flex justify-center items-center my-6">
          <button className="py-3 px-6 text-gray-800 border-2 border-gray-600 hover:bg-gray-600 hover:text-white">
            View cart
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default CartModal;
