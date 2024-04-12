import { Filter } from "../filtering/IFilter";

export interface CourseFilter extends Filter {
  title: string;
  provider: string;
  courseStatus: number;
}
