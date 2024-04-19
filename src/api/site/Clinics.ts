import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IClinics } from "../../interface/Clinics";

const clinicsApi = createApi({
    reducerPath: "clinics",
    tagTypes: ["CLINICS"],
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

        getAllClinics: builder.query<any, { search?: string | null; province?: string | null; status?: string | null; page?: number; resultLimit?: number }>({
            query: ({ search, status, page, resultLimit, province }) => ({
                url: 'public/clinics/all',
                method: 'GET',
                params: { search, status, page, resultLimit, province },
            }),
            providesTags: ['CLINICS']
        }),

        getAllClinicsNChildren: builder.query<any, { search?: string | null; province?: string | null; status?: string | null; page?: number; resultLimit?: number }>({
            query: ({ search, status, page, resultLimit, province }) => ({
                url: 'public/clinics/allNChildren',
                method: 'GET',
                params: { search, status, page, resultLimit, province },
            }),
            providesTags: ['CLINICS']
        }),

        searchClinics: builder.mutation<any, { search: string | null; province: string | null; status: string | null; page: number; resultLimit: number }>({
            query: ({ search, status, page, resultLimit, province }) => ({
                url: 'public/clinics/all',
                method: 'GET',
                params: { search, status, page, resultLimit, province },
            }),

            invalidatesTags: ['CLINICS']
        }),
        getByIdClinics: builder.query<IClinics, number | string>({
            query: (id) => "/public/clinics/get/" + id,
            providesTags: ['CLINICS']
        }),
        adminGetByIdClinics: builder.query<IClinics, number | string>({
            query: (id) => "/admin/clinics/get/" + id,
            providesTags: ['CLINICS']
        }),
        getChildrenClinics: builder.query<IClinics, number | string>({
            query: (id) => "/public/clinics/children/all/" + id,
            providesTags: ['CLINICS']
        }),
        addClinics: builder.mutation({

            query: (packages: any) => ({
                url: "/admin/clinics/create",
                method: "POST",
                body: packages
            }),
            invalidatesTags: ['CLINICS']
        }),

        updateClinics: builder.mutation<any, any>({

            query: ({ id, ...packages }: any) => ({
                url: `admin/clinics/update/${id}`,
                method: "PUT",
                body: packages
            }),
            invalidatesTags: ['CLINICS']
        }),
        deleteClinics: builder.mutation<void, { id: number | string; status: string }>({
            query: ({ id, status }) => ({
                url: `/admin/clinics/delete/${id}`,
                method: "DELETE",
                params: { status }
            }),
            invalidatesTags: ['CLINICS']
        }),

        getHistoryBooking: builder.mutation<any, { fromDate?: string | null; toDate?: string | null; status: string | null; page: number; resultLimit: number }>({
            query: ({ fromDate, toDate, status, page, resultLimit }) => ({
                url: 'user/booking/userGetBookingHistory',
                method: 'POST',
                body: { fromDate, toDate, status, page, resultLimit },
            }),

            invalidatesTags: ['CLINICS']
        }),
    }),
});


export const {
    useGetAllClinicsQuery,
    useGetByIdClinicsQuery,
    useGetChildrenClinicsQuery,
    useAddClinicsMutation,
    useUpdateClinicsMutation,
    useDeleteClinicsMutation,
    useSearchClinicsMutation,
    useGetHistoryBookingMutation,
    useGetAllClinicsNChildrenQuery,
    useAdminGetByIdClinicsQuery

} = clinicsApi;

export const clinicsApiReducer = clinicsApi.reducer;

export default clinicsApi;