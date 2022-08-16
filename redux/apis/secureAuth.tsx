import { adminIdTypings } from "../../models/authTypings";
import { getAppCredentials } from "../../helpers/Auth";
import { secureApiService } from "../service";
const admin_id = getAppCredentials("admin_token")?.admin_id



export const secureApi = secureApiService.injectEndpoints({
    endpoints: (build) => ({
        authAdmin:build.query<adminIdTypings, string>({
            query:(adminId)=>{
                return {
                  url:"admin/"+ admin_id || adminId,
                  method:"GET",
                }
            }
         })  
    })
})

export const { useAuthAdminQuery } = secureApi;