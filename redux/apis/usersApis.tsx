import { getAppCredentials } from "../../helpers/Auth";
import { productsCarts } from "../../models";
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
    getCartItems: build.query<productsCarts, void>({
      query: () => {
        return {
          url: "/get_user_cartItems" + user_id,
          method: "PATCH",
        };
      },
    }),
  }),
});

export const { useAuthAdminQuery, useGetCartItemsQuery } = secureApi;
