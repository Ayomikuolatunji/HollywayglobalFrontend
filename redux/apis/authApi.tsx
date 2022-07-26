import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { apiService } from "../service"


interface loginCredentails {
     email:string
     password:string
}

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