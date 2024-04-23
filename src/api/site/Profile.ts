import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const profileApi = createApi({
    reducerPath: "profiles",
    tagTypes: ["PROFILES"],
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE + "/api/v1/user/profiles/",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {

                headers.set('authorization', `Bearer ${token}`);
            }
            return headers
        }
    }),
    endpoints: (builder) => ({

        getAllProfile: builder.query<any, void>({
            query: () => "getAll",
            providesTags: ['PROFILES']
        }),

        getProfileById: builder.query<any, number | string>({
            query: (id) => `getById/${id}`,
            providesTags: ['PROFILES']
        }),

        getProfileById2: builder.mutation<any, number | string>({
            query: (id) => `getById/${id}`,
            invalidatesTags: ['PROFILES']
        }),
        addProfile: builder.mutation({

            query: (profile: any) => ({
                url: "create",
                method: "POST",
                body: profile
            }),
            invalidatesTags: ['PROFILES']
        }),

        updateProfile: builder.mutation<any, any>({

            query: (packages: any) => ({
                url: `update`,
                method: "PUT",
                body: packages
            }),
            invalidatesTags: ['PROFILES']
        }),

        deleteProfile: builder.mutation<void, any>({
            query: ({ idsToDelete }) => ({
                url: `delete`,
                method: "DELETE",
                body: { idsToDelete }
            }),
            invalidatesTags: ['PROFILES']
        }),
    }),
});


export const {
    useGetAllProfileQuery,
    useGetProfileByIdQuery,
    useAddProfileMutation,
    useUpdateProfileMutation,
    useDeleteProfileMutation,
    useGetProfileById2Mutation

} = profileApi;

export const profileApiReducer = profileApi.reducer;

export default profileApi;