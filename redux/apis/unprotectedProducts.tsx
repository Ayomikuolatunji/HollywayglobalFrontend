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
    fetchAllProducts: build.query<fetchProductTypings, void>({
      query: () => {
        return {
          url: "/user_products",
          method: "GET",
        };
      },
    }),
  }),
});

export const { useFetchDepartmentsQuery, useFetchAllProductsQuery } = unprotectedProductApis;
