import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';
import { SchemaNames } from 'src/constants/schema.names';

export type QuestionDocument = Question & Document;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Question {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SchemaNames.conversation,
    required: true,
  })
  conversation: ObjectId;

  @Prop({
    type: SchemaTypes.String,
  })
  question: string;

  @Prop({
    type: SchemaTypes.String,
  })
  original_answer: string;

  @Prop({
    type: SchemaTypes.String,
    default: null,
  })
  corrected_answer: string;

  @Prop({
    type: SchemaTypes.String,
    default: null,
  })
  paraphrased_answer: string;

  @Prop({
    type: SchemaTypes.String,
  })
  answer_audio_file_url: string;

  @Prop({
    type: SchemaTypes.Date,
  })
  question_prompt_at: Date;

  @Prop({
    type: SchemaTypes.Date,
  })
  answer_submitted_at: Date;

  /// 질문을 이해했는지 여부
  @Prop({
    type: SchemaTypes.Boolean,
    default: null,
  })
  understand_question: boolean;

  /// 답변이 근거 또는 예시를 들어서 잘 답변했는지 여부
  @Prop({
    type: SchemaTypes.Boolean,
    default: null,
  })
  is_answer_valid: boolean;

  /// 답변이 근거 또는 예시를 들어서 잘 답변하지 않았다면, 그 이유
  @Prop({
    type: SchemaTypes.String,
    default: null,
  })
  reason_for_invalidity: string;

  /// 답변에 문법 오류가 있는지 여부
  @Prop({
    type: SchemaTypes.Boolean,
    default: null,
  })
  grammar_errors_found: boolean;

  /// 분석된 답변의 발음 스코어
  @Prop({
    type: SchemaTypes.Number,
    default: null,
    required: false,
  })
  pronunciation_score: number;

  /// 미국발음 예측수치
  @Prop({
    type: SchemaTypes.Number,
    default: null,
    required: false,
  })
  en_US: number;

  /// 영국발음 예측수치
  @Prop({
    type: SchemaTypes.Number,
    default: null,
    required: false,
  })
  en_UK: number;

  /// 호주발음 예측수치
  @Prop({
    type: SchemaTypes.Number,
    default: null,
    required: false,
  })
  en_AU: number;

  /// IELTS 발음 스코어 예측 수치
  @Prop({
    type: SchemaTypes.String,
    required: false,
    default: null,
  })
  ielts: string;

  /// toefl 발음 스코어 예측수치
  @Prop({
    type: SchemaTypes.String,
    required: false,
    default: null,
  })
  toefl: string;

  /// cefr 발음 스코어 예측수치
  @Prop({
    type: SchemaTypes.String,
    required: false,
    default: null,
  })
  cefr: string;

  /// pte_general 발음 스코어 예측수치
  @Prop({
    type: SchemaTypes.String,
    required: false,
    default: null,
  })
  pte_general: string;

  /// 발음 각 단어별 분석결과
  @Prop({
    type: SchemaTypes.Array,
    required: false,
    default: null,
  })
  words: Array<Object>;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
