import { Filter } from "../filtering/IFilter";

export interface ProviderFilter extends Filter {
  providerTitle?: string;
}
