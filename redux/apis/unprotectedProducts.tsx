import {
  fetchProductTypings,
  productsDepartmentsTypesData,
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
    fetchAllProducts: build.query<fetchProductTypings, string>({
      query: (query_name: string) => {
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
      query: (query_name) => {
        return {
          url: `/user_products`,
          method: "GET",
          params: {
            product_type: query_name,
          },
        };
      },
      invalidatesTags: ["ProductItems"],
    }),
  }),
});

export const {
  useFetchDepartmentsQuery,
  useFetchAllProductsQuery,
  useFetchPostDataMutation,
} = unprotectedProductApis;
