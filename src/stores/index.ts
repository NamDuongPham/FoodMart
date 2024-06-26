import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
//import { encryptTransform } from 'redux-persist-transform-encrypt';
import storage from "redux-persist/lib/storage";
import adminRecuer, { AdminType } from "./slices/AdminSlice";
import cartReducer from "./slices/CartSlice";
import searchReducer, { SearchType } from "./slices/SearchSlice";
import userReducer, { UserType } from "./slices/UserSlice";

/* Defining the shape of the state. */
export interface RootStatesType {
  user: UserType;
  admin: AdminType;
  search:SearchType
}

/* Combining all the reducers into one reducer. */
const reducers = combineReducers({
  user: userReducer,
  admin: adminRecuer,
  cart: cartReducer,
  search: searchReducer,
});

/* The key for the redux-persist. */
const ROOT_KEY = "root";

/** encryptor data app */
// const encryptor = encryptTransform({
//   secretKey: ROOT_KEY,
// });

/** The configuration for redux-persist.
 * Add slice name wanna be storage in whitelist
 */
const persistConfig = {
  key: ROOT_KEY,
  version: 1,
  storage,
  whitelist: ["user", "admin","search"],
  // transforms: [encryptor],
};

/* A function that takes two arguments:
- persistConfig: The configuration for redux-persist.
- reducers: The reducers that we want to persist. */
const persistedReducer = persistReducer(persistConfig, reducers);

/* Creating a store with the persisted reducer. */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

/* A function that takes a store as an argument and returns a persisted store. */
export const persistor = persistStore(store);
