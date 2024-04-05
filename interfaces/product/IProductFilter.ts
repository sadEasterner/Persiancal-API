import { Filter } from "../filtering/IFilter";

export interface ProductFilter extends Filter{
    id: number;
    title: string;
    price: number;
    description: string;
    productStatus: number;
}