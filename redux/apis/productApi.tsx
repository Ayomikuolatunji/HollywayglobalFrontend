import { secureApiService } from "../service";
import { getAppCredentials } from "../../helpers/Auth";
import {
  changeProductStatusTypings,
  fetchProductTypings,
  productIdTypings,
  productTypings,
} from "../../models/product";

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
    changeProductStatus: build.mutation<void, changeProductStatusTypings>({
      query: ({ ids, status }) => {
        return {
          url: `/products/product_status`,
          method: "PATCH",
          params: {
            adminId: admin_id && admin_id,
          },
          body: {
            productIds: ids,
            status: status,
          },
        };
      },
      invalidatesTags: ["Product"],
    }),
    editProduct: build.mutation<void, productTypings>({
      query: (body) => ({
        url: `products/${body.id}`,
        method: "PATCH",
        body: { ...body, adminId: admin_id && admin_id },
      }),
      invalidatesTags: ["Product"],
    }),
    getProduct: build.query<productIdTypings, string>({
      query: (productId ) => ({
        url: `products/${productId}`,
        method: "GET",
        params: {
          adminId: admin_id && admin_id,
        },
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  usePostProductMutation,
  useDeleteProductMutation,
  useChangeProductStatusMutation,
  useEditProductMutation,
  useGetProductQuery,
} = productApis;
