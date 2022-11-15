import React, { useState } from "react";
import axios from "axios";
import { productTypings } from "../../models";
import {
  useDecrementCartItemsMutation,
  useIncrementCartItemsMutation,
} from "../../redux/apis/usersApis";

type dataTypes = {
  data: {
    message: string;
    product: productTypings;
  };
};

export default function DetailPage({ data }: dataTypes) {
  const [qty, setQty] = useState<number>(1);
  const [incrementCartItems] = useIncrementCartItemsMutation();
  const [decrementCartItems] = useDecrementCartItemsMutation();
  const decrementQty = () => {
    if (qty <= 1 || qty < -1) return;
    else {
      setQty((prev) => prev - 1);
      decrementCartItemsFunc();
    }
  };
  const incrementCartItemsFunc = async () => {
    try {
      await incrementCartItems(data.product._id!).unwrap();
    } catch (error) {}
  };
  const decrementCartItemsFunc = async () => {
    try {
      await decrementCartItems(data.product._id!).unwrap();
    } catch (error) {}
  };

  const incrementQty = () => {
    setQty((prev) => prev + 1);
    incrementCartItemsFunc();
  };
  console.log(data);
  return (
    <>
      <div className="detail-grid grid md:grid-cols-2 grid-cols-1 md:w-[90%] mx-auto mt-10 gap-5 ">
        <div className="left">
          <img
            src={`http://localhost:8080/${data.product.image}`}
            alt=""
            className="h-[60vh] w-[100%]"
          />
        </div>
        <div className="right px-3 py-5">
          <div className="header flex justify-between w-full">
            <h1 className="text-gray-500 font-extrabold text-2xl">
              {data.product.name}
            </h1>
            <button className="bg-gray-200 rounded-md text-gray-800 font-extrabold py-3 px-2">
              add to cart
            </button>
          </div>
          <div className="details mt-3">
            <h1 className="text-black font-extrabold text-2xl mt-4">Details</h1>
            {/* <p>{data.product.description}</p> */}
            <p className="leading-[30px] font-serif text-[22px]">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe
              vel earum commodi, sunt porro consequuntur tempore id quasi. Quis
              cum corporis ipsam! Nam enim voluptatum similique fugiat nostrum
              voluptate tenetur ab, magni inventore asperiores expedita modi.
              Ratione sequi obcaecati, omnis culpa exercitationem quisquam vero,
              at optio eligendi blanditiis ipsum, eum quidem perferendis? Modi
              optio magnam natus voluptas provident deserunt nobis reprehenderit
              qui quae inventore. Possimus rem porro sit eius quod ipsum minima,
              sint iusto architecto tempora quae voluptates dolorum consequatur
              et expedita quis distinctio fugiat quo, perferendis libero
              explicabo ullam, ut nam. Qui velit expedita, consequuntur debitis
              rerum praesentium blanditiis.
            </p>
          </div>
          <div className="quty flex justify-between items-center w-full">
            <div className="mt-10 w-[30%] bg-bla">
              <h1>Number</h1>
              <div>
                <button onClick={decrementQty} className="mr-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline-flex w-6 h-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
                <span>{qty}</span>
                <button onClick={incrementQty} className="ml-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline-flex w-6 h-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>{" "}
            <div className="mt-10 w-[30%] bg-bla">
              <h1>Price</h1>
              <p>{data.product.price}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

type params = {
  params: { productId: string };
};

export async function getServerSideProps({ params }: params) {
  try {
    const res = await axios(
      `http://localhost:8080/api/v1/user_product/${params.productId}`
    );
    const data = await res.data;
    return { props: { data } };
  } catch (error) {
    return { props: { error } };
  }
}
