import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const configBookingApi = createApi({
    reducerPath: "configBooking",
    tagTypes: ["CONFIG_BOOKING"],
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
        getAllConfigs: builder.query<any, string>({
            query: (id) => ({
                url: '/admin/auto-schedule-config/getAllConfigs/' + id,
                method: 'GET',
            }),
            providesTags: ['CONFIG_BOOKING']
        }),

        getByIdConfig: builder.query<any, { idDoctor: string, id: string }>({
            query: ({ idDoctor, id }) => `/admin/auto-schedule-config/getDetailConfigs/${idDoctor}/${id}`,
            providesTags: ['CONFIG_BOOKING']
        }),

        addConfig: builder.mutation<any, any>({
            query: (config: any) => ({
                url: `/admin/auto-schedule-config/createConfigs`,
                method: "POST",
                body: config
            }),
            invalidatesTags: ['CONFIG_BOOKING']
        }),

        updateConfig: builder.mutation<any, any>({
            query: (config: any) => ({
                url: `/admin/auto-schedule-config/updateConfigs`,
                method: "PUT",
                body: config
            }),
            invalidatesTags: ['CONFIG_BOOKING']
        }),
        deleteConfig: builder.mutation<void, any>({
            query: (config) => ({
                url: `/admin/auto-schedule-config/deleteConfigs`,
                method: "DELETE",
                body: config
            }),
            invalidatesTags: ['CONFIG_BOOKING']
        }),
        getConfigsInAWeek: builder.query<any, string>({
            query: (id) => ({
                url: '/admin/auto-schedule-config/getConfigsInAWeek/' + id,
                method: 'GET',
            }),
            providesTags: ['CONFIG_BOOKING']
        }),
        saveConfigsInAWeek: builder.mutation<any, any>({
            query: (config: any) => ({
                url: `/admin/auto-schedule-config/saveConfigsInAWeek`,
                method: "PUT",
                body: config
            }),
            invalidatesTags: ['CONFIG_BOOKING']
        }),
    }),
});


export const {
    useGetAllConfigsQuery,
    useGetByIdConfigQuery,
    useAddConfigMutation,
    useUpdateConfigMutation,
    useDeleteConfigMutation,
    useGetConfigsInAWeekQuery,
    useSaveConfigsInAWeekMutation


} = configBookingApi;

export const configBookingApiReducer = configBookingApi.reducer;

export default configBookingApi;