import type { NextPage } from 'next'
import Head from 'next/head'
import TopNavBar  from "../layouts/Home/TopNav/TopNavBar";

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

         {/* topNavBar */}
         
         <TopNavBar />

       
    </div>
  )
}

export default Home
