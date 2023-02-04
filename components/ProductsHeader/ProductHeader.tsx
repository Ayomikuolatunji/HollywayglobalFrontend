import React from "react";

interface ProductHeaderProps {
  title: string;
  width: number;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ title, width }) => {
  return (
    <div className="relative">
      <h1
        className={`text-[#1c1c1c] relative font-[700] text-[26px] after:absolute after:left-0 after:right-0 after:h-[4px] after:w-[${width}px] after:mx-auto after:my-0 after:bg-main-deep-color after:bottom-[-3px] text-center p-4`}
      >
        {title}
      </h1>
      <hr className="h-5" />
    </div>
  );
};

export default ProductHeader;
