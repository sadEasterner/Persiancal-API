export interface Filter {
    currentPage: number | null;
    itemPerPage: number | null;
    isAscending: boolean | null;
    sortOn : string | null;
}