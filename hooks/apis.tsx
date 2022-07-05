import axios from "axios";

const url="http://localhost:8080/api/v1";


export const createAccount = async (account:{},endpoints:string) => {
     try {
         const response=await axios({
            method: "POST",
            headers:{
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                ...account
            }),
            url: url+endpoints,
         })

         return response.data;
     } catch (error) {
         return error;
     }
}

