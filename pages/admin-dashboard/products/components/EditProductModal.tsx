import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { FaCarAlt } from "react-icons/fa"
import {
  productIdTypings,
  productTypings
} from "../../../../models/product";

import { useGetProductQuery } from "../../../../redux/apis/productApi";

export default function EditProductModal({ productId }: productIdTypings) {
  const { data } = useGetProductQuery(productId);
  const [initialValues, setInitialValues] = useState<productTypings>({
    adminId: "",
    name: "",
    price: "",
    description: "",
    type: "",
    currency: "",
  });

  useEffect(() => {
    const getData: productTypings | any= data!
    if (getData) {
      setInitialValues({
        adminId: getData.adminId,
        name: getData.name,
        price: getData.price,
        description: getData.description,
        type: getData.type,
        currency: getData.currency,
      });
    }
  }, [data]);

  console.log(initialValues);

  return <div>
         
  </div>;
}
