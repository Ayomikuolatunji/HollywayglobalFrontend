import { secureApiService } from "../service";
import { getAppCredentials } from "../../helpers/Auth";
import { productTypings } from "../../models/product";
const admin_id = getAppCredentials("admin_token")?.admin_id;

export const productApis = secureApiService.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<productTypings[], void>({
      query: () => ({
        url: `/products/`,
        method: "GET",
        params: {
          adminId: admin_id,
        },
      }),
    }),
    postProduct: build.mutation<void, productTypings>({
      query: (body) => {
        console.log(admin_id);
        return {
          url: `/products`,
          method: "POST",
          body: { ...body, adminId: admin_id && admin_id }
        };
      },
    }),
  }),
});

export const { useGetProductsQuery, usePostProductMutation } = productApis;
