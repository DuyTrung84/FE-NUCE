import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface IManage {
    fromDate?: string;
    toDate?: string;
    fromTime?: string;
    toTime?: string;
    doctorId?: string;
    type?: string;
    status?: string;
    clinicId?: string;
    specialityId?: string;
    page?: number;
    resultLimit?: number;
}

const bookingApi = createApi({
    reducerPath: "booking",
    tagTypes: ["BOOKING"],
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
        getBooking: builder.query<any, string>({
            query: (id: string) => ({
                url: `public/schedules/get`,
                method: 'GET',
                params: { id },
            }),
            providesTags: ['BOOKING']
        }),
        searchBooking: builder.mutation<any, { idDoctor: string, fromDate: string, toDate: string }>({
            query: ({ idDoctor, fromDate, toDate }) => ({
                url: `admin/doctors/getSchedules`,
                method: 'GET',
                params: { idDoctor, fromDate, toDate },
            }),
            invalidatesTags: ['BOOKING']
        }),

        addBooking: builder.mutation<any, any>({

            query: (booking: any) => ({
                url: `admin/doctors/createSchedules`,
                method: "POST",
                body: booking
            }),
            invalidatesTags: ['BOOKING']
        }),

        updateBooking: builder.mutation<any, any>({

            query: (booking: any) => ({
                url: `admin/doctors/updateSchedules`,
                method: "PUT",
                body: booking
            }),
            invalidatesTags: ['BOOKING']
        }),

        deleteBooking: builder.mutation<void, any>({
            query: ({ idDoctor, idsToDelete }) => ({
                url: `admin/doctors/deleteSchedules`,
                method: "POST",
                body: { idDoctor, idsToDelete }
            }),
            invalidatesTags: ['BOOKING']
        }),

        getStatusBooking: builder.query<any, void>({
            query: () => ({
                url: `public/bookingStatus`,
                method: 'GET',
            }),
            providesTags: ['BOOKING']
        }),

        getWhoPay: builder.query<any, void>({
            query: () => "public/whoPay",
            providesTags: ["BOOKING"],
        }),

        getBookingById: builder.query<any, number | string>({
            query: (id) => "/public/schedules/detail/" + id,
            providesTags: ['BOOKING']
        }),

        searchManage: builder.mutation<any, IManage>({
            query: (IManage) => ({
                url: `/admin/booking/search`,
                method: 'GET',
                params: IManage,
            }),
            invalidatesTags: ['BOOKING']
        }),

        exportManage: builder.mutation<any, IManage>({
            query: (IManage) => ({
                url: `/admin/booking/export`,
                method: 'GET',
                params: IManage,
            }),
            invalidatesTags: ['BOOKING']
        }),
    }),
});


export const {
    useGetBookingQuery,
    useSearchBookingMutation,
    useAddBookingMutation,
    useUpdateBookingMutation,
    useDeleteBookingMutation,
    useGetStatusBookingQuery,
    useGetWhoPayQuery,
    useGetBookingByIdQuery,
    useSearchManageMutation,
    useExportManageMutation,
} = bookingApi;

export const bookingApiReducer = bookingApi.reducer;

export default bookingApi;