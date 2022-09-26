import type { NextPage } from 'next'
import Head from 'next/head'
import TopNavBar from '../components/Wrapper/TopNav/TopNavBar'
import Carousel from '../layouts/Home/Carousel/Carousel'
import Products from '../layouts/Home/products/Products'



const Home: NextPage = () => {


  
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/assets/logo.png" />
      </Head>
  
         {/* Homepage */}
         {/* <Carousel/>
         <Products/> */}
    </div>
  )
}

export default Home
