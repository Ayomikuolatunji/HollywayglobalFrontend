import React, { useEffect, useState } from 'react'
import { productIdTypings, productTypings } from '../../../../models/product';

import { useGetProductQuery } from '../../../../redux/apis/productApi';

export default function EditProductModal({productId}:productIdTypings) {
  const {data}=useGetProductQuery(productId);
  const [initialValues, setInitialValues] = useState<productTypings>({
    adminId: "",
    name: "",
    price: "",
    description: "",
    type: "",
    currency: "",
  });

  useEffect(() => {
    // if(data){
    //   setInitialValues({
    //     adminId: data.adminId,
    //     name: data.name,
    //     price: data.price,
    //     description: data.description,
    //     type: data.type,
    //     currency: data.currency,
    //   });
    // }   
  })

  console.log(data)


  return (
    <div>EditProductModal</div>
  )
}
