import "../styles/globals.css";
import type { AppProps } from "next/app";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useRouter } from 'next/router'

import HeaderWrapper from "../layouts/wrapper/HeaderWrapper";
import PageWrapper from "../layouts/wrapper/PageWrapper";
import { store, persistor } from "../redux/store";
import AdminWrapper from "../layouts/wrapper/AdminWrapper/Main";
import * as helper from "../helpers";


function MyApp({ Component, pageProps }: AppProps) {
  const router=useRouter()
    if(router.pathname.startsWith("/admin-dashboard")) {
        return (
          <div className="lg:w-[65%] md:w-[70%] sm:w-[80%] mx-auto w-[97%]">
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <AdminWrapper>
                  <Component {...pageProps} />
                  <helper.Toastify/>
              </AdminWrapper>
            </PersistGate>
          </Provider>
        </div>
        )
    }

    


  return (
    <div className="lg:w-[65%] md:w-[70%] sm:w-[80%] mx-auto w-[97%]">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <HeaderWrapper>
            <PageWrapper>
              <Component {...pageProps} />
              <helper.Toastify/>
            </PageWrapper>
          </HeaderWrapper>
        </PersistGate>
      </Provider>
    </div>
  );
}

export default MyApp;
