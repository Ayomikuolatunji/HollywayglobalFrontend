import type { NextPage } from 'next'
import Head from 'next/head'
import TopNavBar  from "./Home/TopNav/TopNavBar";

const Home: NextPage = () => {
  return (
    <div className="block">
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
