import { adminSecureApiService } from "../service";
import { getAppCredentials } from "../../helpers/Auth";
import {
  changeProductStatusTypings,
  fetchProductTypings,
  productIds,
  productIdTypings,
  productsDepartmentsTypes,
  productTypings,
  singleProductTypings,
} from "../../models/product";

const admin_id = getAppCredentials("admin_token", "admin")?.admin_id;

export const productApis = adminSecureApiService.injectEndpoints({
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
          url: `products/product_status`,
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
      query: ({ _id, ...body }) => ({
        url: `products/${_id}`,
        method: "PATCH",
        body: {
          name: body.name,
          price: body.price,
          description: body.description,
          type: body.type || "general",
          image: body.image,
          adminId: body.adminId,
          status: body.status,
          currency:body.currency,
        },
        params: {
          adminId: admin_id && admin_id,
        },
      }),
      invalidatesTags: ["Product"],
    }),
    getProduct: build.query<productIdTypings, string>({
      query: (productId) => ({
        url: `products/${productId}`,
        method: "GET",
        params: {
          adminId: admin_id && admin_id,
        },
      }),
      transformResponse: (res: singleProductTypings | any) => res.product,
      providesTags: ["Product"],
    }),
    bulkyDelete: build.mutation<void, productIds>({
      query: ({ ids }) => ({
        url: "products/delete_many",
        method: "DELETE",
        body: {
          productIds: ids,
        },
        params: {
          adminId: admin_id && admin_id,
        },
      }),
      invalidatesTags: ["Product"],
    }),
    createProductDepartments: build.mutation<void, productsDepartmentsTypes>({
      query: ({ name }) => {
        return {
          url: "/create_products_departments",
          method: "POST",
          body: {
            name: name,
            adminId: admin_id,
          },
          params: {
            adminId: admin_id && admin_id,
          },
        };
      },
      invalidatesTags: ["Department"],
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
  useBulkyDeleteMutation,
  useCreateProductDepartmentsMutation,
} = productApis;
