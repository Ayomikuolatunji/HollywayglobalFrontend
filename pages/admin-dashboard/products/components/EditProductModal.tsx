import React, { useEffect } from 'react'
import { productIdTypings } from '../../../../models/product';

import { useGetProductQuery } from '../../../../redux/apis/productApi';

export default function EditProductModal({productId}:productIdTypings) {
  const {data}=useGetProductQuery(productId);

  console.log(data)


  return (
    <div>EditProductModal</div>
  )
}
