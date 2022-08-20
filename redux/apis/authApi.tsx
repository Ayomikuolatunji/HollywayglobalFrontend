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
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),
    signup: build.mutation<void, signupTypings>({
      query: (body: any) => ({
        url: "create_account",
        method: "POST",
        body,
      }),
    }),
    adminSignup: build.mutation<void, adminSignupTypings>({
      query: (body) => ({
        url: "create_admin",
        method: "POST",
        body,
      }),
    }),
    adminLogin: build.mutation<void, loginCredentails>({
      query: (credentials) => {
        return {
          url: "admin_signin",
          method: "POST",
          body: credentials,
        };
      },
      invalidatesTags: ["Product","admin"],
    })
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useAdminSignupMutation,
  useAdminLoginMutation
} = authApi;
