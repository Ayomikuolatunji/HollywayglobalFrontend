import { adminIdTypings } from "../../models/authTypings";
import { getAppCredentials } from "../../helpers/Auth";
import { adminSecureApiService } from "../service";
const admin_id = getAppCredentials("admin_token", "admin")?.admin_id;

export const secureApi = adminSecureApiService.injectEndpoints({
  endpoints: (build) => ({
    authAdmin: build.query<adminIdTypings, string>({
      query: (adminId) => {
        return {
          url: "admin/" + admin_id || adminId,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useAuthAdminQuery } = secureApi;
