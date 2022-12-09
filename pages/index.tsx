import type { NextPage } from "next";
import Head from "next/head";
import Carousel from "../layouts/Home/Carousel/Carousel";
import LocalCategories from "../layouts/Home/LocalCatergories/LocalCategories";
import ProductSlider from "../layouts/Home/ProductSlider/ProductSlider";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/assets/logo.png" />
      </Head>
      <div className="bg-white md:w-[70%] mx-auto">
        <div className="flex justify-end w-[75%] ml-auto">
          <Carousel />
        </div>
        <ProductSlider />
        <LocalCategories />
      </div>
    </div>
  );
};

export default Home;
