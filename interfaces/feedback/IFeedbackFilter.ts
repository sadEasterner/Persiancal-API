import { Filter } from "../filtering/IFilter";

export interface FeedbackFilter extends Filter {
  senderName: string;
  companyName: string;
  text: string;
  email: string;
  phoneNumber: string;
}
