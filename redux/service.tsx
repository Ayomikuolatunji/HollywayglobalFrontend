import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAppCredentials } from "../helpers/Auth";

const admin_token = getAppCredentials();

export const apiService = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  endpoints: () => ({}),
});

export const secureApiService = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1",
    prepareHeaders: (headers) => {
      if (admin_token?.admin_token) {
        headers.set("Content-Type", "application/json");
        headers.set("Accept", "application/json");
        headers.set("Authorization", `Bearer ${admin_token.admin_token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
