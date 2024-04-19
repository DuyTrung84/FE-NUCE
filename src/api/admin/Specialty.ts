import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ISpecialty } from "../../interface/Specialty";

const specialtyApi = createApi({
    reducerPath: "specialty",
    tagTypes: ["SPECIALTY"],
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

        getAllSpecialty: builder.query<any, { name?: string | null; status?: string | null; page?: number; resultLimit?: number }>({
            query: ({ name, status, page, resultLimit }) => ({
                url: 'public/specialities/all',
                method: 'GET',
                params: { name, status, page, resultLimit },
            }),
            providesTags: ['SPECIALTY']
        }),

        searchAllSpecialty: builder.mutation<any, { name: string | null; status: string | null; page: number; resultLimit: number }>({
            query: ({ name, status, page, resultLimit }) => ({
                url: 'public/specialities/all',
                method: 'GET',
                params: { name, status, page, resultLimit },
            }),
            invalidatesTags: ['SPECIALTY']
        }),
        getByIdSpecialty: builder.query<ISpecialty, number | string>({
            query: (id) => "/public/specialities/get/" + id,
            providesTags: ['SPECIALTY']
        }),
        adminGetByIdSpecialty: builder.query<ISpecialty, number | string>({
            query: (id) => "/admin/specialities/get/" + id,
            providesTags: ['SPECIALTY']
        }),
        addSpecialty: builder.mutation<any, any>({
            query: (specialty: any) => ({
                url: "/admin/specialities/create",
                method: "POST",
                body: specialty
            }),
            invalidatesTags: ['SPECIALTY']
        }),
        updateSpecialty: builder.mutation<any, any>({
            query: (specialty: any) => ({
                url: `admin/specialities/update/${specialty.id}`,
                method: "PUT",
                body: specialty
            }),
            invalidatesTags: ['SPECIALTY']
        }),
        deleteSpecialty: builder.mutation<void, { id: string; status: string }>({
            query: ({ id, status }) => ({
                url: `/admin/specialities/delete/${id}`,
                method: "DELETE",
                params: { status }
            }),
            invalidatesTags: ['SPECIALTY']
        }),
    }),
});


export const {
    useGetAllSpecialtyQuery,
    useGetByIdSpecialtyQuery,
    useAddSpecialtyMutation,
    useUpdateSpecialtyMutation,
    useDeleteSpecialtyMutation,
    useSearchAllSpecialtyMutation,
    useAdminGetByIdSpecialtyQuery

} = specialtyApi;

export const specialtyApiReducer = specialtyApi.reducer;

export default specialtyApi;