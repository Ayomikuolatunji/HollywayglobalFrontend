import React from "react";
import { useCreatePaymentMutation } from "../../redux/apis/usersApis";

export default function Checkout() {
  const [createPayment] = useCreatePaymentMutation();

  const createCheckoutPayment = () => {
    createPayment({})
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return <div></div>;
}
