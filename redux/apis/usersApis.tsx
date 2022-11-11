import { getAppCredentials } from "../../helpers/Auth";
import { fetchedUserDetails } from "../../models/user";
import { userSecureApiService } from "../service";
const user_id = getAppCredentials("user_token", "user")?.user_id;

export const secureApi = userSecureApiService.injectEndpoints({
  endpoints: (build) => ({
    authAdmin: build.query<fetchedUserDetails, void>({
      query: () => {
        return {
          url: "single_user/",
          method: "GET",
          params: {
            userId: user_id,
          },
        };
      },
    }),
  }),
});

export const { useAuthAdminQuery } = secureApi;
