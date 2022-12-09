import React from "react";
import { DetailItemProps } from "../../models";

export default function DetailsImg({ product }: DetailItemProps) {
  return (
    <div>
      <img
        src={`http://localhost:8080/${product.image}`}
        alt={product.name}
        className="max-w-full w-full max-h-full h-full"
      />
    </div>
  );
}
