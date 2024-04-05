import { Filter } from "../filtering/IFilter";

export interface UserFilter extends Filter{
    username: string;
    name: string;
    email: string;
    userStatus?: number;
    address: string;
}