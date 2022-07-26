import "../styles/globals.css";
import type { AppProps } from "next/app";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import HeaderWrapper from "../layouts/wrapper/HeaderWrapper";
import PageWrapper from "../layouts/wrapper/PageWrapper";
import { store, persistor } from "../redux/store";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="lg:w-[65%] md:w-[70%] sm:w-[80%] mx-auto w-[97%]">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
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
        </PersistGate>
      </Provider>
    </div>
  );
}

export default MyApp;
