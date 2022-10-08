import { fetchProductTypings, productsDepartmentsTypesData } from "../../models/product";
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
      query: (query_name) => {
        return {
          url: "/user_products",
          method: "GET",
          params:{
            product_type:query_name
          }
        };
      },
    }),
  }),
});

export const { useFetchDepartmentsQuery, useFetchAllProductsQuery } = unprotectedProductApis;
