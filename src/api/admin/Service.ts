import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const serviceApi = createApi({
    reducerPath: "service",
    tagTypes: ["SERVICE"],
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE + "/api/v1/admin/user/",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers
        }
    }),
    endpoints: (builder) => ({

        getAllService: builder.mutation<any, number | string>({
            query: (id) => "getAllService/" + id,
            invalidatesTags: ['SERVICE']
        }),

        getByIdService: builder.query<any, number | string>({
            query: (id) => "getDetailByServiceId/" + id,
            providesTags: ['SERVICE']
        }),

        deleterServiceDoctor: builder.mutation<void, any>({

            query: (service: any) => ({
                url: `deleteServiceBaseOnDoctor`,
                method: "DELETE",
                body: service
            }),
        }),

        addService: builder.mutation<any, any>({

            query: (service: any) => ({
                url: `createServiceBaseOnDoctor`,
                method: "POST",
                body: service
            }),
            invalidatesTags: ['SERVICE']
        }),

        updateService: builder.mutation<any, any>({

            query: (service: any) => ({
                url: `updateServiceBaseOnDoctor`,
                method: "PUT",
                body: service
            }),
            invalidatesTags: ['SERVICE']
        }),
    }),
});


export const {
    useGetAllServiceMutation,
    useGetByIdServiceQuery,
    useAddServiceMutation,
    useUpdateServiceMutation,
    useDeleterServiceDoctorMutation

} = serviceApi;

export const serviceApiReducer = serviceApi.reducer;

export default serviceApi;