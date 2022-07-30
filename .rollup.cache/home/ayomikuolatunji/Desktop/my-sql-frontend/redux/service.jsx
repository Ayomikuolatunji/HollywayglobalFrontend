import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export var apiService = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8080/api/v1",
        prepareHeaders: function (headers) {
            headers.set("Content-Type", "application/json");
            headers.set("Accept", "application/json");
            return headers;
        },
    }),
    endpoints: function () { return ({}); },
});
export var secureApiService = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8080/api/v1",
        prepareHeaders: function (headers) {
            headers.set("Content-Type", "application/json");
            headers.set("Accept", "application/json");
            return headers;
        },
    }),
    endpoints: function () { return ({}); },
});
//# sourceMappingURL=service.jsx.map