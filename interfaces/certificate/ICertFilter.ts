import { Filter } from "../filtering/IFilter";

export interface CertFilter extends Filter {
  title: string;
  provider: string;
  certificateStatus: number;
}
