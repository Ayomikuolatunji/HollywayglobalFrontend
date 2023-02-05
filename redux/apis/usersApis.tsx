import { getAppCredentials } from "../../helpers/Auth";
import { localStorageGetItem } from "../../helpers/Storage";
import { productsCarts } from "../../models";
import { fetchedUserDetails } from "../../models/user";
import { userSecureApiService } from "../service";
const user_id = getAppCredentials("user_token", "user")?.user_id;

export const secureApi = userSecureApiService.injectEndpoints({
  endpoints: (build) => ({
    authUser: build.query<fetchedUserDetails, void>({
      query: () => {
        return {
          url: "single_user/",
          method: "GET",
          params: {
            userId: user_id,
          },
        };
      },
      providesTags: ["Cart", "Product"],
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
    addToCartItem: build.mutation<void, string>({
      query: (productId) => {
        return {
          url: `add_product_to_cart/${user_id}`,
          method: "POST",
          params: {
            productId: productId,
          },
        };
      },
      invalidatesTags: ["Cart", "Products"],
    }),
    deleteCartItem: build.mutation<void, { cartId: string; productId: string }>(
      {
        query: ({ cartId, productId }) => {
          return {
            url: `delete_cart_item/${user_id}`,
            method: "DELETE",
            params: {
              cartId: cartId,
              productId: productId,
            },
          };
        },
        invalidatesTags: ["Cart", "Products"],
      }
    ),
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
    createPayment: build.mutation<void, any>({
      query: (productId) => {
        return {
          url: `create_user_payment/${user_id}`,
          method: "PATCH",
          params: {
            userId: localStorageGetItem("userId"),
          },
        };
      },
    }),
  }),
});

export const {
  useAuthUserQuery,
  useGetCartItemsQuery,
  useDeleteCartItemMutation,
  useIncrementCartItemsMutation,
  useDecrementCartItemsMutation,
  useAddToCartItemMutation,
} = secureApi;
