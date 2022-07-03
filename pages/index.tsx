import type { NextPage } from 'next'
import Head from 'next/head'
import HomePage from "../layouts/Home"


const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

         {/* Homepage */}
         
         <HomePage />

    </div>
  )
}

export default Home
