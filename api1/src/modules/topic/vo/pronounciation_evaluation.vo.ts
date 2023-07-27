export class PronounciationEvaluationVo {
  score: number;
  en_US: number;
  en_UK: number;
  en_AU: number;
  ielts: string;
  toefl: string;
  cefr: string;
  pte_general: string;
  words: Array<Object>;

  constructor(
    score: number,
    en_US: number,
    en_UK: number,
    en_AU: number,
    ielts: string,
    toefl: string,
    cefr: string,
    pte_general: string,
    words: Array<Object>,
  ) {
    this.score = score;
    this.en_US = en_US;
    this.en_UK = en_UK;
    this.en_AU = en_AU;
    this.ielts = ielts;
    this.toefl = toefl;
    this.cefr = cefr;
    this.pte_general = pte_general;
    this.words = words;
  }
}
