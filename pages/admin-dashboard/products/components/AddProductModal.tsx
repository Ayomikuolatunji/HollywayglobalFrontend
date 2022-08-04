import React, { useState } from "react";
import { Dialog } from "@headlessui/react";


import { modalConditions } from "../../../../models/modal";
import { productTypings } from "../../../../models/product";
import { usePostProductMutation } from "../../../../redux/apis/productApi";
import * as helper from "../../../../helpers"

const AddProductModal = ({ isOpen, setIsOpen }: modalConditions) => {
  const [postProdcts] = usePostProductMutation();
  const [file, setFile] = useState("");
  const [productAvailable,setProductAvailable] = useState(false);
  const [initialValues, setInitialValues] = useState<productTypings>({
    adminId: "",
    name: "",
    price: "",
    description: "",
    type: "",
  });

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleProductAvailable=(e:any)=>{
    setProductAvailable(e.target.checked)
  }

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (file) {
      const fileData = new FormData();
      fileData.append("file", file);
      fetch("http://localhost:8080/images", {
        method: "POST",
        body: fileData,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          postProdcts({ ...initialValues,productAvailable,image: data.imageUrl })
            .unwrap()
            .then((data: any) => {
              if(data.message==="Product created successfully"){
                  setIsOpen(false);
              }
              console.log(data);
            })
            .catch((err:any) => console.log(err));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  console.log(productAvailable)

  const handleChange = (e: any) => {
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
      <Dialog.Panel className="bg-white border  flex justify-center flex-col items-center w-[30%]">
        <Dialog.Title className="p-4">Add a new Product</Dialog.Title>
        <hr className="w-full" />
        <Dialog.Description className="flex justify-center items-center w-[100%]">
          <form onSubmit={onSubmit} className="w-full">
            <div className="flex flex-col w-[100%]">
              <input
                id="name"
                name="name"
                placeholder="product name"
                onChange={(e) => handleChange(e)}
                value={initialValues.name}
                type="text"
                className="w-[90%] mx-auto border-2 border-gray-400 my-2 p-[5px]"
              />
              <input
                id="price"
                name="price"
                placeholder="product price"
                type="number"
                onChange={(e) => handleChange(e)}
                value={initialValues.price}
                className="w-[90%] mx-auto border-2 border-gray-400 my-2 p-[5px]"
              />
              <textarea
                id="description"
                name="description"
                placeholder="product description"
                value={initialValues.description}
                onChange={(e) => handleChange(e)}
                className="w-[90%] mx-auto border-2 border-gray-400 my-2 p-[5px]"
              />
              <input
                id="image"
                name="image"
                type="file"
                onChange={(e) => handleFileChange(e)}
                placeholder="product image"
                className="w-[90%] mx-auto border-2 border-gray-400 my-2 p-[5px]"
              />
              {/* is product available checkbox */}
               <div className="flex items-center w-[100%]">
               <label htmlFor="productAvailable">
                   Is product available?
                </label>
                <input
                  id="productAvailable"
                  name="productAvailable"
                  type="checkbox"
                  onChange={(e)=>handleProductAvailable(e)}
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
                <option value="">Select Auto Type</option>
                {helper.navItems.slice(1,helper.navItems.length).map((option,index)=>(
                  <option value={option.name}>{option.name}</option>
                ))}
              </select>
              <div className="w-[40%] mx-auto my-2 p-[5px]">
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
        </Dialog.Description>
      </Dialog.Panel>
    </Dialog>
  );
};
export default AddProductModal;
