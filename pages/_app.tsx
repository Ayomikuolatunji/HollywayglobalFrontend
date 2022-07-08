import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import HeaderWrapper from '../layouts/wrapper/HeaderWrapper'
import PageWrapper from '../layouts/wrapper/PageWrapper';


function MyApp({ Component, pageProps }: AppProps) {
  return <div className='sm:w-[65%] mx-auto w-[97%]'>
    <HeaderWrapper>
      <PageWrapper>
        <Component {...pageProps} />
        <ToastContainer 
          limit={1}
          theme="dark"
          position="bottom-center"
          autoClose={3000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </PageWrapper>
    </HeaderWrapper>
</div>
}

export default MyApp
