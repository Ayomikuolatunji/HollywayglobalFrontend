import type { NextPage } from 'next'
import Head from 'next/head'
import Carousel from '../layouts/Home/Carousel/Carousel'



const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

         {/* Homepage */}
         <Carousel/>
    </div>
  )
}

export default Home
