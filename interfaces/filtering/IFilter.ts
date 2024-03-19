export interface sortItem {
    isAscending: boolean | null;
    sortOn : string | null;
}
export interface Paging{
    currentPage: number | null;
    itemPerPage: number | null;
}
export interface Filter {
    sortItem: sortItem;
    paging: Paging;
    model : any | null;
    isExact: boolean | null;
}