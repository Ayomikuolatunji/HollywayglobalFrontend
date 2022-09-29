import { Dialog } from "@headlessui/react";
import React, { ReactEventHandler } from "react";
import { modalConditions } from "../../../../models/modal";
import { useCreateProductDepartmentsMutation } from "../../../../redux/apis/productApi";

export default function AddDepartments({ setIsOpen, isOpen }: modalConditions) {
  const [createProductDepartments] = useCreateProductDepartmentsMutation();

  const onSubmit = async (e:React.SyntheticEvent) => {
    e.preventDefault();
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
          Add New Products Deparments
        </Dialog.Title>
        <hr className="w-full" />
        <Dialog.Panel className="flex justify-center flex-col items-center w-[100%] p-2">
          <form action="" onSubmit={(e) => onSubmit(e)}>
            <div className="p-3 w-full">
              <input
                type="text"
                placeholder="Enter department name"
                className="w-full p-3 border-2"
              />
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
          </form>
        </Dialog.Panel>
      </Dialog.Panel>
    </Dialog>
  );
}
