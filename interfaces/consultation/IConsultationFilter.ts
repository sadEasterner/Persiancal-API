import { Filter } from "../filtering/IFilter";

export interface ConsultationFilter extends Filter {
  title: string;
  provider: string;
  consultationStatus: number;
}
