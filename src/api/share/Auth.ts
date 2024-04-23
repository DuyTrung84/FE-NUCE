import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface AuthSignup {
    email?: string;
    password?: string;
    name?: string;
    passwordConfirm?: string;
    lastName?: string;
    phone?: string;
    agreement?: string;

}
export interface AuthSignin {
    email?: string;
    password?: string;
    rememberMe?: boolean;
    token?: string;
    refreshToken?: string;
    role?: string
}

const authApi = createApi({
    reducerPath: "auth",
    tagTypes: ["AUTH"],
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE + "/api/v1/auth",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({

        signup: builder.mutation<any, any>({
            query: (account) => ({
                url: "register",
                method: "POST",
                body: account,
            }),
        }),
        signin: builder.mutation<any, any>({
            query: (account) => ({
                url: "login",
                method: "POST",
                body: account,
            }),
        }),
        logOut: builder.mutation<void, void>({
            query: (account) => ({
                url: "/company/logout",
                method: "DELETE",
                body: account,
            }),
        }),
        emailVerificaiton: builder.query<string, string>({
            query: (token) => "/email-verification/" + token,
            providesTags: ["AUTH"],
        }),
    }),
});

export const {
    useSignupMutation,
    useSigninMutation,
    useEmailVerificaitonQuery,
    useLogOutMutation,

} = authApi;

export const authApiReducer = authApi.reducer;

export default authApi;