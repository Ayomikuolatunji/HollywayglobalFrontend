import React from "react";
import { productTypings } from "../../models/product";

interface ProductCardTypes {
  items: productTypings;
}

export default function ProductCard({ items }: ProductCardTypes) {
  return <div>Product.Card</div>;
}
