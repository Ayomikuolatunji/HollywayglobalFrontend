import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { loginCredentails } from "../../models/authTypings"
import { apiService } from "../service"


export const authApi = apiService.injectEndpoints({
    endpoints:build=>({
     login:build.mutation<void, loginCredentails>({
          query:(credentials)=>({
               url:"/login",
               method:"POST",
               body:credentials
          })
     })
    })
})

export const { useLoginMutation } =authApi