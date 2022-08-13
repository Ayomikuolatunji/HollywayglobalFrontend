import { secureApiService } from "../service";
import { getAppCredentials } from "../../helpers/Auth";
import { fetchProductTypings, productTypings } from "../../models/product";
import { productIdTypings } from "../../models/authTypings";
const admin_id = getAppCredentials("admin_token")?.admin_id;

export const productApis = secureApiService.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<fetchProductTypings, void>({
      query: () => ({
        url: `products`,
        method: "GET",
        params: {
          adminId: admin_id,
        },
      }),
      providesTags: ["Product"],
    }),
    postProduct: build.mutation<void, productTypings>({
      query: (body) => ({
        url: `products`,
        method: "POST",
        body: { ...body, adminId: admin_id && admin_id },
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: build.mutation<void, productIdTypings>({
      query: ({ productId }) => {
        return {
          url: `products/${productId}`,
          method: "DELETE",
          params: {
            adminId: admin_id && admin_id,
          },
        };
      },
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  usePostProductMutation,
  useDeleteProductMutation,
} = productApis;
