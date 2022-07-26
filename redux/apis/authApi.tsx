import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { loginCredentails } from "../../models/authTypings";
import { apiService } from "../service";

interface signupTypings {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

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
      query: (body) => {
        return {
          url: "/signup",
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = authApi;
