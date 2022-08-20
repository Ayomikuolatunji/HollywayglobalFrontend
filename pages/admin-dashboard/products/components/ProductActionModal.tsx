import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { FaCarAlt } from "react-icons/fa";

import { modalConditions } from "../../../../models/modal";
import { productTypings } from "../../../../models/product";
import { usePostProductMutation } from "../../../../redux/apis/productApi";
import { currencyOptions } from "../../../../helpers/utils";
import * as helper from "../../../../helpers";
import validate from "./ValidateProduct";
import ProductForm from "./ProductForm";
import { toast } from "react-toastify";

const ProductActionModal = ({ isOpen, setIsOpen }: modalConditions) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: any = e.currentTarget.files;
    setFile(file[0] || "");
  };

  const handleProductAvailable = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCarStatus(e.target.checked);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    // check if inputs are empty
    if (!validate(initialValues)) {
      return;
    }
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
            status: carStatus,
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
    }else{
      toast.error("Please upload an image",{
        toastId: "imageUploadError",
      });
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
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
          <FaCarAlt />
          Add a New Car
        </Dialog.Title>
        <hr className="w-full" />
        <Dialog.Panel className="flex justify-center items-center w-[100%]">
          <ProductForm
            onSubmit={onSubmit}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleProductAvailable={handleProductAvailable}
            setIsOpen={setIsOpen}
            initialValues={initialValues}
          />
        </Dialog.Panel>
      </Dialog.Panel>
    </Dialog>
  );
};
export default ProductActionModal;
