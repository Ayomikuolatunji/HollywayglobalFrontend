import { AiFillHeart } from "react-icons/ai";
import { Dialog } from "@headlessui/react";
import { modalConditions, ProductCardTypes } from "../../models";

const CartModal = ({
  setIsOpen,
  isOpen,
  item,
  addToCartItemFunc,
}: modalConditions & ProductCardTypes) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="w-full h-[100vh] fixed top-0 right-0 left-0 bottom-0 flex justify-center items-center z-[999]"
    >
      <Dialog.Panel className="bg-white border flex justify-center flex-col items-center w-[20%] rounded-md relative group">
        <Dialog.Description className="w-full p-2">
          <img
            className="h-[300px] w-full object-cover mt-2"
            src={`http://localhost:8080/${item.image}`}
            alt="NIKE AIR"
          />
          <div className="flex flex-col text-center mt-5">
            <Dialog.Title className="p-4 text-gray-800 font-extrabold text-center text-[18px]">
              {item.name}
            </Dialog.Title>
          </div>
        </Dialog.Description>
        <div className="w-[100%] flex justify-between mx-auto my-2 p-4 z-[999]">
          <h1 className="text-[20px]">
            <span className="text-xl text-gray-800 font-extrabold">
              {item.currency}
            </span>
            <span className="text-xl text-gray-800 font-extrabold">
              {item.price}
            </span>
          </h1>
          {item.item_in_cart ? (
            <button>already in cart</button>
          ) : (
            <button
              type="submit"
              onClick={() => {
                addToCartItemFunc && addToCartItemFunc(item._id!);
              }}
              className="py-3 px-4 text-black bg-gray-100 rounded-lg font-bold"
            >
              Add to cart
            </button>
          )}
        </div>
        <div className="wishlist absolute invisible group-hover:visible bg-[rgba(0,0,0,0.01)] w-full h-full">
          <AiFillHeart className="text-[60px]  cursor-pointer text-red-500 z-[1000]" />
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default CartModal;
