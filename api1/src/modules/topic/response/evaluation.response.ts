import { ApiProperty } from "@nestjs/swagger";

class Grammer {
  @ApiProperty({
    default : "What kind of music do you usually listen to?",
    type : String
  })
  question: string;
  @ApiProperty({
    default : "i like the weekend",
    type : String
  })
  original_answer: string;
  @ApiProperty({
    default : "I like the singer The Weekend.",
    type : String
  })
  corrected_answer: string;
  @ApiProperty({
    default : "I'm a big fan of The Weekend's music. He's my jam!",
    type : String
  })
  paraphrased_answer: string;
}

class Score {
  @ApiProperty({
    default : 8,
    type : Number
  })
  grammar_range_accuracy: Number;
  @ApiProperty({
    default : 8,
    type : Number
  })
  lexical_resource: Number;
  @ApiProperty({
    default : 9,
    type : Number
  })
  fluency_coherence: Number;
}

export class EvaluationResponse {
  @ApiProperty({
    type : [Grammer]
  })
  grammer : [Grammer]

  // @ApiProperty({
  //   type : Score
  // })
  // score : Score
}