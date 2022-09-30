import type { NextPage } from "next";
import Head from "next/head";
import HomeRightLeftWrapper from "../components/Wrapper/HomeRightLeftWrapper";
import ProductSlider from "../layouts/Home/ProductSlider/ProductSlider";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/assets/logo.png" />
      </Head>

      <div className="bg-white  w-[70%] mx-auto">
        <HomeRightLeftWrapper />
        <ProductSlider />
      </div>
    </div>
  );
};

export default Home;
