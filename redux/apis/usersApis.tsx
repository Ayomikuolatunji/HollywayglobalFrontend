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
          url: `get_user_cartItems/${user_id}`,
          method: "GET",
        };
      },
      providesTags: ["Cart"],
    }),
    deleteCartItem: build.mutation<void, string>({
      query: (cartId) => {
        return {
          url: `delete_cart_item/${user_id}`,
          method: "DELETE",
          params: {
            cartId: cartId,
          },
        };
      },
      invalidatesTags: ["Cart"],
    }),
    incrementCartItems: build.mutation<void, string>({
      query: (productId) => {
        return {
          url: `increment_product_cartItem/${user_id}`,
          method: "PATCH",
          params: {
            productId: productId,
          },
        };
      },
      invalidatesTags: ["Cart"],
    }),
    decrementCartItems: build.mutation<void, string>({
      query: (productId) => {
        return {
          url: `decrement_product_cartItem/${user_id}`,
          method: "PATCH",
          params: {
            productId: productId,
          },
        };
      },
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useAuthAdminQuery,
  useGetCartItemsQuery,
  useDeleteCartItemMutation,
  useIncrementCartItemsMutation,
  useDecrementCartItemsMutation
} = secureApi;
