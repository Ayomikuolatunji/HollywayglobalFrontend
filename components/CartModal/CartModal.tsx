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
      <Dialog.Panel className="bg-white border flex justify-center flex-col items-center w-[30%] rounded-md">
        <Dialog.Title className="p-4 text-blue-500 font-extrabold flex items-center text-2xl">
          Product details
        </Dialog.Title>
        <Dialog.Description className="w-full p-4">
          <img
            className="h-[240px] w-full object-cover mt-2"
            src={`http://localhost:8080/${item.image}`}
            alt="NIKE AIR"
          />
          <p>{item.description}</p>
        </Dialog.Description>

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
            Add to cart
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default CartModal;
