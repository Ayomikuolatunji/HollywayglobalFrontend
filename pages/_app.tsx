import "../styles/globals.css";
import type { AppProps } from "next/app";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useRouter } from "next/router";

import HeaderWrapper from "../components/Wrapper/HeaderWrapper";
import PageWrapper from "../components/Wrapper/PageWrapper";
import { store, persistor } from "../redux/store";
import AdminWrapper from "../components/AdminWrapper/Main";
import * as helper from "../helpers";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  if (router.pathname.startsWith("/admin-login") || router.pathname.startsWith("/admin-signup")) {
    return (
      <div className="lg:w-[55%] flex justify-center items-center h-screen md:w-[70%] sm:w-[80%] mx-auto w-[97%]">
           <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Component {...pageProps} />
            <helper.Toastify />
          </PersistGate>
        </Provider>
      </div>
    );
  }

  if (
    ["/admin-dashboard", "/admin-dashboard/products"].includes(router.pathname)
  ) {
    return (
      <div className="lg:w-[85%] md:w-[70%] sm:w-[80%] mx-auto w-[97%]">
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AdminWrapper>
              <Component {...pageProps} />
              <helper.Toastify />
            </AdminWrapper>
          </PersistGate>
        </Provider>
      </div>
    );
  }

  return (
    <div className="lg:w-[65%] md:w-[70%] sm:w-[80%] mx-auto w-[97%]">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <HeaderWrapper>
            <PageWrapper>
              <Component {...pageProps} />
              <helper.Toastify />
            </PageWrapper>
          </HeaderWrapper>
        </PersistGate>
      </Provider>
    </div>
  );
}

export default MyApp;
