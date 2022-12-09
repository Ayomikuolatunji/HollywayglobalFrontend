import { QueryString } from "../../models/next-types";
import {
  fetchProductTypings,
  productsDepartmentsTypesData,
  singleProductTypings,
} from "../../models/product";
import { apiService } from "../service";

export const unprotectedProductApis = apiService.injectEndpoints({
  endpoints: (build) => ({
    fetchDepartments: build.query<productsDepartmentsTypesData, void>({
      query: () => {
        return {
          url: "/all_department",
          method: "GET",
        };
      },
    }),
    fetchAllProducts: build.query<fetchProductTypings, QueryString>({
      query: ({ query_name }) => {
        return {
          url: "/user_products",
          method: "GET",
          params: {
            product_type: query_name,
          },
        };
      },
      providesTags: ["ProductItems"],
    }),
    fetchPostData: build.mutation<void, string>({
      query: () => {
        return {
          url: `/user_products`,
          method: "GET",
          params: {
            product_type: "all",
          },
        };
      },
      invalidatesTags: ["ProductItems"],
    }),
    singleUserProduct: build.query<singleProductTypings, string>({
      query: (productId) => {
        return {
          url: "/user_product/" + productId,
          method: "GET",
        };
      },
      providesTags: ["ProductItems"],
    }),
  }),
});

export const {
  useFetchDepartmentsQuery,
  useFetchAllProductsQuery,
  useFetchPostDataMutation,
  useSingleUserProductQuery,
} = unprotectedProductApis;
