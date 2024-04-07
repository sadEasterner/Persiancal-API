import { Filter } from "../filtering/IFilter";

export interface LabFilter extends Filter {
  name: string;
  labStatus: number;
}
