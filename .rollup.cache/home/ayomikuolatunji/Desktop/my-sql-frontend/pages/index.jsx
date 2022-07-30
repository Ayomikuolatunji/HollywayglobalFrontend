import Head from 'next/head';
import Carousel from '../layouts/Home/Carousel/Carousel';
import Products from '../layouts/Home/products/Products';
var Home = function () {
    return (<div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/assets/logo.png"/>
      </Head>

         {/* Homepage */}
         <Carousel />
         <Products />
    </div>);
};
export default Home;
//# sourceMappingURL=index.jsx.map