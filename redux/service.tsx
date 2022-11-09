import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAppCredentials } from "../helpers/Auth";

const admin = getAppCredentials("admin_token", "admin");
const user = getAppCredentials("user_token", "user");

export const apiService = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NODE_ENV === "production"
        ? "https://myql-learn-db.herokuapp.com/api/v1/"
        : "http://localhost:8080/api/v1/",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Product", "admin", "Department"],
  endpoints: () => ({}),
});

export const tutorSecureApiService = createApi({
  reducerPath: "secureApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NODE_ENV == "production"
        ? "https://myql-learn-db.herokuapp.com/api/v1/"
        : "http://localhost:8080/api/v1/",
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
  tagTypes: ["Product", "admin", "Department"],
  endpoints: () => ({}),
});

export const userSecureApiService = createApi({
  reducerPath: "secureApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NODE_ENV == "production"
        ? "https://myql-learn-db.herokuapp.com/api/v1/"
        : "http://localhost:8080/api/v1/",
    prepareHeaders: (headers) => {
      if (user?.user_id && user.user_token) {
        headers.set("Content-Type", "application/json");
        headers.set("Accept", "application/json");
        headers.set("Authorization", `Bearer ${user?.user_token}`);
      }
      return headers;
    },
  }),
  refetchOnReconnect: true,
  tagTypes: ["Product", "admin", "Department"],
  endpoints: () => ({}),
});
