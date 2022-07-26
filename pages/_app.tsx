import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import store from '../redux/store';

import HeaderWrapper from '../layouts/wrapper/HeaderWrapper'
import PageWrapper from '../layouts/wrapper/PageWrapper';


function MyApp({ Component, pageProps }: AppProps) {
  return <div className='lg:w-[65%] md:w-[70%] sm:w-[80%] mx-auto w-[97%]'>
    <Provider store={store}>
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
    </Provider>
</div>
}

export default MyApp
