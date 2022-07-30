import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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


export const secureApiService=createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  endpoints: () => ({}),
})