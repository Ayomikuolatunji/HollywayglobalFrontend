import { apiService } from "../service";
export var authApi = apiService.injectEndpoints({
    endpoints: function (build) { return ({
        login: build.mutation({
            query: function (credentials) { return ({
                url: "/login",
                method: "POST",
                body: credentials,
            }); },
        }),
        signup: build.mutation({
            query: function (body) { return ({
                url: "/create_account",
                method: "POST",
                body: body,
            }); },
        }),
        adminSignup: build.mutation({
            query: function (body) { return ({
                url: "/create_admin",
                method: "POST",
                body: body,
            }); },
        }),
        adminLogin: build.mutation({
            query: function (credentials) {
                return {
                    url: "/admin_signin",
                    method: "POST",
                    body: credentials,
                };
            },
        }),
    }); },
});
export var useLoginMutation = authApi.useLoginMutation, useSignupMutation = authApi.useSignupMutation, useAdminSignupMutation = authApi.useAdminSignupMutation, useAdminLoginMutation = authApi.useAdminLoginMutation;
//# sourceMappingURL=authApi.jsx.map