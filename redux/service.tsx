import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAppCredentials } from "../helpers/Auth";

const admin = getAppCredentials("admin_token");

export const apiService = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1/",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  endpoints: () => ({}),
});

export const secureApiService = createApi({
  reducerPath: "secureApi",
   baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1/",
    prepareHeaders: (headers) => {
      if (admin?.admin_id && admin.admin_token) {
        headers.set("Content-Type", "application/json");
        headers.set("Accept", "application/json");
        headers.set("Authorization", `Bearer ${admin.admin_token}`);
      }
      return headers;
    },
  }),
  refetchOnReconnect: true,
  tagTypes: ["Product"],
  endpoints: () => ({}),
});
