import {secureApiService} from "../service";
import { getAppCredentials } from "../../helpers/Auth";
import { productTypings } from "../../models/product";
const admin_id = getAppCredentials();

const productApis=secureApiService.injectEndpoints({
    endpoints: (build) => ({
        getProducts: build.query<void, productTypings[]>({
            query: () => ({
                url: `/products/`,
                method: "GET",
                params: {
                    adminId: admin_id?.admin_id,
                }
            })
        })
    })
})