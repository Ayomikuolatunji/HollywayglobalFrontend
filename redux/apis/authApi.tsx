import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  adminSignupTypings,
  loginCredentails,
  signupTypings,
} from "../../models/authTypings";
import { apiService } from "../service";

export const authApi = apiService.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<void, loginCredentails>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    signup: build.mutation<void, signupTypings>({
      query: (body) => ({
        url: "/create_account",
        method: "POST",
        body,
      }),
    }),
    adminSignup: build.mutation<void, adminSignupTypings>({
      query: (body) => ({
        url: "/create_admin",
        method: "POST",
        body,
      }),
    }),
    adminLogin: build.mutation<void, loginCredentails>({
          query: (credentials) => ({
               url: "/login_admin",
               method: "POST",
               body: credentials,
          })
    })
  }),
});

export const { useLoginMutation, useSignupMutation, useAdminSignupMutation } =
  authApi;
