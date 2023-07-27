export class GrammerEvaluationVO {
  question: string;
  original_answer: string;
  corrected_answer: string;
  paraphrased_answer: string;
  understand_question: boolean;
  is_answer_valid: boolean;
  grammar_errors_found: boolean;
  reason_for_invalidity: string;
}