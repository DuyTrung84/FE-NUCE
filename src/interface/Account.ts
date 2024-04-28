export interface IAccount {
    name?: string;
    avatar?: string;
    email?: string;
    id?: string;
    role?: string;
    status?: string | number;
    data?: IAccount;
    currentPage?: number;
    totalItems?: number
}