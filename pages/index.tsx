import type { NextPage } from 'next'
import Head from 'next/head'
import HomeRightLeftWrapper from '../components/Wrapper/HomeRightLeftWrapper'
import ProductSlider from '../layouts/Home/ProductSlider/ProductSlider'



const Home: NextPage = () => {


  
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/assets/logo.png" />
      </Head>

      <HomeRightLeftWrapper/>
      <ProductSlider/>
    </div>
  )
}

export default Home
