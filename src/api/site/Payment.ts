import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const paymentApi = createApi({
    reducerPath: "payment",
    tagTypes: ["PAYMENT"],
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE + "/api/v1/payment/",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {

                headers.set('authorization', `Bearer ${token}`);
            }
            return headers
        }
    }),
    endpoints: (builder) => ({

        createFreeOrder: builder.mutation<any, any>({

            query: (payment: any) => ({
                url: "createFreeOrder",
                method: "POST",
                body: payment
            }),
            invalidatesTags: ['PAYMENT']
        }),

        createPayment: builder.mutation<any, any>({

            query: (payment: any) => ({
                url: "createPayment",
                method: "POST",
                body: payment
            }),
            invalidatesTags: ['PAYMENT']
        }),

        resultPayment: builder.mutation<any, any>({
            query: (result) => ({
                url: 'checkPaymentResult',
                method: 'GET',
                params: result,
            }),
            invalidatesTags: ['PAYMENT']
        }),

        cancelAppointment: builder.mutation<any, any>({

            query: (payment: any) => ({
                url: "cancelAppointment",
                method: "POST",
                body: payment
            }),
            invalidatesTags: ['PAYMENT']
        }),
    }),
});


export const {
    useCreateFreeOrderMutation,
    useCreatePaymentMutation,
    useResultPaymentMutation,
    useCancelAppointmentMutation
} = paymentApi;

export const paymentApiReducer = paymentApi.reducer;

export default paymentApi;