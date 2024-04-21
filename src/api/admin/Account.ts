import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IAccount } from "../../interface/Account";


const accountApi = createApi({
    reducerPath: "account",
    tagTypes: ["ACCOUNT"],
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE + "/api/v1/admin/user",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {

                headers.set('authorization', `Bearer ${token}`);
            }
            return headers
        }
    }),
    endpoints: (builder) => ({
        getAllAccount: builder.mutation<IAccount, { keyword: string | null; role: string | null; status: string | null; clinic: string | null; speciality: string | null; page: number; resultLimit: number }>({
            query: ({ keyword, role, status, clinic, speciality, page, resultLimit }) => ({
                url: "/getAll",
                method: "POST",
                body: { keyword, role, status, clinic, speciality, page, resultLimit }
            }),
            invalidatesTags: ['ACCOUNT']
        }),
        addAccount: builder.mutation<any, any>({
            query: (account: IAccount) => ({
                url: "/create",
                method: "POST",
                body: account
            }),
            invalidatesTags: ['ACCOUNT']
        }),
        deleteAccount: builder.mutation<void, { id: string; status: string }>({
            query: ({ id, status }) => ({
                url: `${id}`,
                method: "DELETE",
                params: { status }
            }),
            invalidatesTags: ['ACCOUNT']
        }),
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        getRole: builder.query<any, void>({
            query: () => "/role",
            providesTags: ['ACCOUNT']
        }),

    }),
});


export const {
    useAddAccountMutation,
    useDeleteAccountMutation,
    useGetRoleQuery,
    useGetAllAccountMutation

} = accountApi;

export const accountApiReducer = accountApi.reducer;

export default accountApi;