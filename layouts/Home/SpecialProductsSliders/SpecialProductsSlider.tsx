import React from "react";
import { productTypings } from "../../../models";
import { useFetchAllProductsQuery } from "../../../redux/apis/unprotectedProducts";
import { SpecialProduct } from "./SpecialProduct";

interface internalDataItem {
  title: string;
  data: Array<productTypings>;
}

const SpecialProductsSlider: React.FC = ({}) => {
  const { data } = useFetchAllProductsQuery({ query_name: "all" });

  const groupedData = data?.products
    .filter(
      (item) =>
        item.type === "Popular Foods" ||
        item.type === "Fruits/Vegetables" ||
        item.type === "Tubers/Cereals"
    )
    .reduce((acc, item) => {
      const existingGroup = acc.find((group: any) => group.type === item.type);
      if (existingGroup) {
        existingGroup.data.push({
          name: item.name,
          _id: item._id,
          price: item.price,
          image: item.image,
        });
      } else {
        acc.push({
          type: item.type,
          data: [
            {
              name: item.name,
              _id: item._id,
              price: item.price,
              image: item.image,
            },
          ],
        });
      }
      return acc;
    }, [] as { type: string; data: Array<{ name: string; _id: string; image: string; price: string }> }[]);

  const mappedData: internalDataItem[] = groupedData?.map((group: any) => ({
    title: group.type,
    data: group.data,
  }));
  return (
    <div className="grid grid-cols-3 gap-7 items-start justify-center mt-16">
      {mappedData?.map((item: internalDataItem, index) => {
        return <SpecialProduct product={item} key={index} />;
      })}
    </div>
  );
};

export default SpecialProductsSlider;
