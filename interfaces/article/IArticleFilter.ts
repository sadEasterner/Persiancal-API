import { Filter } from "../filtering/IFilter";

export interface ArticleFilter extends Filter {
  title: string;
  provider: string;
  articleStatus: number;
}
