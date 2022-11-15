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
    incrementCartItems: build.mutation<
      void,
      { productId: string; cartId: string }
    >({
      query: ({ productId, cartId }) => {
        return {
          url: `increment_product_cartItem/${user_id}`,
          method: "PATCH",
          params: {
            productId: productId,
            cartId: cartId,
          },
        };
      },
      invalidatesTags: ["Cart"],
    }),
    decrementCartItems: build.mutation<
      void,
      { productId: string; cartId: string }
    >({
      query: ({ productId, cartId }) => {
        return {
          url: `decrement_product_cartItem/${user_id}`,
          method: "PATCH",
          params: {
            productId: productId,
            cartId: cartId,
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
  useDecrementCartItemsMutation,
  useAddToCartItemMutation,
} = secureApi;
