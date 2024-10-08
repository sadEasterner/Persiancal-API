import { Filter } from "../filtering/IFilter";

export interface ActivityFilter extends Filter {
  providerTitle: string;
}
