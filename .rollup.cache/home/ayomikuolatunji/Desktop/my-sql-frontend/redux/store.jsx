var _a;
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { apiService } from "./service";
var persistConfig = {
    key: "root",
    storage: storage,
    whitelist: ["auth"],
};
var rootReducer = combineReducers((_a = {},
    _a[apiService.reducerPath] = apiService.reducer,
    _a));
var persistedReducer = persistReducer(persistConfig, rootReducer);
var store = configureStore({
    reducer: persistedReducer,
    middleware: function (getDefaultMiddleware) {
        return getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(apiService.middleware);
    },
});
setupListeners(store.dispatch);
var persistor = persistStore(store);
export { store, persistor };
//# sourceMappingURL=store.jsx.map