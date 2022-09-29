import { Dialog } from "@headlessui/react";
import React, { ReactEventHandler, useState } from "react";
import { toast } from "react-toastify";
import { modalConditions } from "../../../../models/modal";
import { productsDepartmentsTypes } from "../../../../models/product";
import { useCreateProductDepartmentsMutation } from "../../../../redux/apis/productApi";

export default function AddDepartments({ setIsOpen, isOpen }: modalConditions) {
  const [createProductDepartments] = useCreateProductDepartmentsMutation();
  const [nameObj, setName] = useState<productsDepartmentsTypes>({
    name: "",
  });
  const onSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!nameObj.name) {
        toast.info("Department name required", {
          toastId: "AddDepartments-validation-error-id",
        });
        return false;
      }
      createProductDepartments({
        name: nameObj.name,
      })
        .unwrap()
        .then((res) => {
          console.log(res);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setName({ ...nameObj, [name]: value });
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
        <Dialog.Panel className="flex justify-center items-center w-[100%] p-2">
          <form  onSubmit={(e) => onSubmit(e)} className="w-full">
            <div className="p-3 w-[100%]">
              <input
                type="text"
                name="name"
                value={nameObj.name}
                placeholder="Enter department name"
                className="w-full p-3 border-2"
                onChange={(e) => handleChange(e)}
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
