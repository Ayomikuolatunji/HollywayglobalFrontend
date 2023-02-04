import type { NextPage } from "next";
import Head from "next/head";
import Carousel from "../layouts/Home/Carousel/Carousel";
import FarmImplement from "../layouts/Home/FarmImplement/FarmImplement";
import LocalCategories from "../layouts/Home/LocalCatergories/LocalCategories";
import ExportProducts from "../layouts/Home/ExportProducts/ExportProducts";
import SpecialProductsSlider from "../layouts/Home/SpecialProductsSliders/SpecialProductsSlider";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/assets/logo.png" />
      </Head>
      <div className="bg-white md:max-w-[1270px] mx-auto">
        <div className="flex justify-end w-[75%] ml-auto">
          <Carousel />
        </div>
        <ExportProducts />
        <LocalCategories />
        <SpecialProductsSlider />
        {/* <FarmImplement /> */}
      </div>
    </div>
  );
};

export default Home;
