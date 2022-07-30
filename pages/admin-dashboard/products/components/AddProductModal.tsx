import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { modalConditions } from "../../../../models/modal";
import {
  Formik,
  Form,
  Field,
} from "formik";
import { productTypings } from "../../../../models/product";
import { usePostProductMutation } from "../../../../redux/apis/productApi";

const AddProductModal = ({ isOpen, setIsOpen }: modalConditions) => {
  const [postProdcts]=usePostProductMutation(); 

  const initialValues: productTypings = {
    adminId: "",
    name: "",
    price: "",
    description: "",
    image: "",
    type: "",
    createdAt: new Date(),
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
          <Formik
            initialValues={initialValues}
            onSubmit={(values, actions) => {
              postProdcts(values).then((data) => {
                setIsOpen(false);
                console.log(data);
              })
              .catch(err=>console.log(err));
              actions.setSubmitting(false);
            }}
          >
            <Form className="flex flex-col w-[100%]">
              <Field
                id="name"
                name="name"
                placeholder="product name"
                type="text"
                className="w-[90%] mx-auto border-2 border-gray-400 my-2 p-[5px]"
              />
              <Field
                id="price"
                name="price"
                placeholder="product price"
                type="number"
                className="w-[90%] mx-auto border-2 border-gray-400 my-2 p-[5px]"
              />
              <Field
                id="description"
                name="description"
                placeholder="product description"
                as="textarea"
                className="w-[90%] mx-auto border-2 border-gray-400 my-2 p-[5px]"
              />
              <Field
                id="image"
                name="image"
                type="file"
                placeholder="product image"
                className="w-[90%] mx-auto border-2 border-gray-400 my-2 p-[5px]"
              />
              <Field
                as="select"
                name="type"
                id="type"
                className="w-[90%] mx-auto border-2 border-gray-400 my-2 p-[5px]"
              >
                <option value="red">Red</option>

                <option value="green">Green</option>

                <option value="blue">Blue</option>
              </Field>
              <div className="w-[40%] mx-auto my-2 p-[5px]">
                <button onClick={() => setIsOpen(false)} className="text-blue-500 mx-3 font-extrabold">Cancel</button>
                <button type="submit" className="py-[6px] px-[15px] mx-3 bg-blue-500 text-white">Submit</button>
              </div>
            </Form>
          </Formik>
        </Dialog.Description>
      </Dialog.Panel>
    </Dialog>
  );
};

export default AddProductModal;
