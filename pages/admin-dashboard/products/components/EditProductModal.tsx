import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { FaCarAlt } from "react-icons/fa";
import { productIdTypings, productTypings } from "../../../../models/product";

import { useGetProductQuery,useEditProductMutation} from "../../../../redux/apis/AdminProductApi";
import { modalConditions } from "../../../../models/modal";
import ProductForm from "./ProductForm";
import validate from "./ValidateProduct";


export default function EditProductModal({
  productId,
  isOpen,
  setIsOpen,
}: productIdTypings & modalConditions) {
  const { data } = useGetProductQuery(productId);
  const [editProduct] = useEditProductMutation();
  const [file, setFile] = useState("");
  const [submiting, setSubmiting] = useState(false);
  const [previousImage,setPreviousImage] = useState<string>("");
  const [carStatus, setCarStatus] = useState(false);
  const [initialValues, setInitialValues] = useState<productTypings>({
    adminId: "",
    name: "",
    price: "",
    description: "",
    type: "",
    currency: "",
  });

  useEffect(() => {
    const getData: productTypings | any = data!;
    if (getData) {
      setInitialValues({
        _id:productId,
        adminId: getData.adminId,
        name: getData.name,
        price: getData.price,
        description: getData.description,
        type: getData.type,
        currency: getData.currency,
      });
      setPreviousImage(getData.image);
    }
  }, [data]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: any = e.currentTarget.files;
    setFile(file[0] || "");
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
    setSubmiting(true)
      const fileData = new FormData();
      fileData.append("file", file);
      fetch("http://localhost:8080/images", {
        method: "POST",
        body: fileData,
      })
        .then((res) => res.json())
        .then((data) => {
          editProduct({
            ...initialValues,
            status: carStatus,
            image: data.imageUrl || previousImage,
          })
            .unwrap()
            .then((data: any) => {
              if (data.message === "Product updated successfully") {
                setSubmiting(false)
                setIsOpen(false);
              }
            })
            .catch((err: any) => console.log(err));
        })
        .catch((err) => {
          console.log(err);
        });
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
           Edit Car Product
        </Dialog.Title>
        <hr className="w-full" />
        <Dialog.Panel className="flex justify-center items-center w-[100%]">
          <ProductForm
            onSubmit={onSubmit}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleProductAvailable={handleProductAvailable}
            setIsOpen={setIsOpen}
            imageExist={true}
            imageUrl={previousImage}
            initialValues={initialValues}
            submiting={submiting}
          />
        </Dialog.Panel>
      </Dialog.Panel>
    </Dialog>
  );
}
