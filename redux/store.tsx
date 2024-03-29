import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  apiService,
  adminSecureApiService,
  userSecureApiService,
} from "./service";

const persistConfig = {
  key: "ecommerce",
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  [apiService.reducerPath]: apiService.reducer,
  [adminSecureApiService.reducerPath]: adminSecureApiService.reducer,
  [userSecureApiService.reducerPath]: userSecureApiService.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([
      apiService.middleware,
      adminSecureApiService.middleware,
      userSecureApiService.middleware,
    ]),
});
setupListeners(store.dispatch);

let persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export { store, persistor };
