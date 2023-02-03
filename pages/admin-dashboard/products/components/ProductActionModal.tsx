import React, { useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import { FaCarAlt } from "react-icons/fa";
import { toast } from "react-toastify";

import { modalConditions } from "../../../../models/modal";
import { productTypings } from "../../../../models/product";
import { usePostProductMutation } from "../../../../redux/apis/AdminProductApi";
import validate from "./ValidateProduct";
import ProductForm from "./ProductForm";

const ProductActionModal = ({ isOpen, setIsOpen }: modalConditions) => {
  const [postProdcts] = usePostProductMutation();
  const [file, setFile] = useState("");
  const [submiting, setSubmiting] = useState(false);
  const [carStatus, setCarStatus] = useState(false);
  const [imageExist, setImageExist] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [initialValues, setInitialValues] = useState<productTypings>({
    adminId: "",
    name: "",
    price: "",
    description: "",
    type: "",
    currency: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageExist(true);
    const file: any = e.currentTarget.files;
    setFile(file[0] || "");
    setImagePreview(URL.createObjectURL(file[0]));
  };

  const handleProductAvailable = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCarStatus(e.target.checked);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // check if inputs are empty
    if (!validate(initialValues)) {
      return;
    }
    setSubmiting(true);
    if (file) {
      setSubmiting(true);
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
                setSubmiting(false);
                setIsOpen(false);
              }
              setImageExist(false);
            })
            .catch((err: any) => console.log(err));
        })
        .catch((err) => {
          console.log(err);
          setSubmiting(false);
        });
    } else {
      toast.error("Please upload an image", {
        toastId: "imageUploadError",
      });
      setSubmiting(false);
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
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
        <Dialog.Title className="p-4 text-main-color font-extrabold flex items-center text-2xl">
          Add a new product
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
            imageExist={imageExist}
            imagePreview={true}
            imageUrl={imagePreview}
            submiting={submiting}
          />
        </Dialog.Panel>
      </Dialog.Panel>
    </Dialog>
  );
};
export default ProductActionModal;
