import "../styles/globals.css";
import type { AppProps } from "next/app";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useRouter } from "next/router";
import { ThemeProvider } from "@mui/material/styles";

import HeaderWrapper from "../components/Wrapper/HeaderWrapper";
import { store, persistor } from "../redux/store";
import AdminWrapper from "../components/AdminWrapper/Main";
import * as helper from "../helpers";
import NetWorkWrapper from "../layouts/NetworkWrapper/NetWorkWrapper";
import { ErrorBoundary } from "../components";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const theme = {};

  if (
    router.pathname.startsWith("/admin-login") ||
    router.pathname.startsWith("/admin-signup") ||
    router.pathname.startsWith("/login") ||
    router.pathname.startsWith("/signup")
  ) {
    return (
      <div className="w-full">
        <ErrorBoundary>
          <NetWorkWrapper>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <Component {...pageProps} />
                <helper.Toastify />
              </PersistGate>
            </Provider>
          </NetWorkWrapper>
        </ErrorBoundary>
      </div>
    );
  }

  if (
    [
      "/admin-dashboard",
      "/admin-dashboard/products",
      "/admin-dashboard/departments",
    ].includes(router.pathname)
  ) {
    return (
      <ErrorBoundary>
        <div className="lg:w-[100%] md:w-[70%] sm:w-[80%] mx-auto w-[97%] h-[100%]">
          <NetWorkWrapper>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <AdminWrapper>
                  <Component {...pageProps} />
                  <helper.Toastify />
                </AdminWrapper>
              </PersistGate>
            </Provider>
          </NetWorkWrapper>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <div className="lg:w-[100%] md:w-[1000%] sm:w-[80%] mx-auto w-[97%]">
      <ErrorBoundary>
        <ThemeProvider theme={theme}>
          <NetWorkWrapper>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <HeaderWrapper>
                  <Component {...pageProps} />
                  <helper.Toastify />
                </HeaderWrapper>
              </PersistGate>
            </Provider>
          </NetWorkWrapper>
        </ThemeProvider>
      </ErrorBoundary>
    </div>
  );
}

export default MyApp;
