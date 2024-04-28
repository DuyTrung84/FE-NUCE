import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IAccount } from "../../interface/Account";

const uploadApi = createApi({
    reducerPath: "upload",
    tagTypes: ["UPLOAD"],
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE + "/api/v1",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers
        }
    }),
    endpoints: (builder) => ({
        upload: builder.mutation({

            query: (image: any) => ({
                url: "/upload",
                method: "POST",
                body: image
            }),
            invalidatesTags: ['UPLOAD']
        }),
        uploadMultipart: builder.mutation({

            query: (image: any) => ({
                url: "/upload/nfiles",
                method: "POST",
                body: image
            }),
            invalidatesTags: ['UPLOAD']
        }),

        getAccount: builder.query<IAccount, void>({
            query: () => "/account/me",
            providesTags: ["UPLOAD"],
        }),

        getStatus: builder.query<any, void>({
            query: () => "/public/objectStatus",
            providesTags: ["UPLOAD"],
        }),

        getPayment: builder.query<any, void>({
            query: () => "/public/payment",
            providesTags: ["UPLOAD"],
        })
    }),
});


export const {
    useUploadMutation,
    useGetAccountQuery,
    useGetStatusQuery,
    useGetPaymentQuery,
    useUploadMultipartMutation

} = uploadApi;

export const uploadApiReducer = uploadApi.reducer;

export default uploadApi;