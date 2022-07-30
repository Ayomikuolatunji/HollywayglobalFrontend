import { secureApiService } from "../service";
import { getAppCredentials } from "../../helpers/Auth";
import { productTypings } from "../../models/product";
const admin_id = getAppCredentials();

export const productApis = secureApiService.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<productTypings[], void>({
      query: () => ({
        url: `/products/`,
        method: "GET",
        params: {
          adminId: admin_id?.admin_id,
        },
      }),
    }),
    postProduct: build.mutation<void, productTypings>({
      query: (body: any) => {
        return {
          url: `/products/`,
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const { useGetProductsQuery, usePostProductMutation } = productApis;
