import { Injectable } from '@nestjs/common';
import { InjectModel, ModelDefinition } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SchemaNames } from 'src/constants/schema.names';
import { ConversationDocment } from 'src/schemas/conversation.schema';
import { QuestionDocument, QuestionSchema } from 'src/schemas/question.schema';
import { QuestionModel } from '../topic/dto/conversation.dto';
import { GrammerEvaluationVO } from '../topic/vo/grammer.evaluation.vo';
import { PronounciationEvaluationVo } from '../topic/vo/pronounciation_evaluation.vo';

@Injectable()
export class QuestionProvider {
  static models: ModelDefinition[] = [
    { schema: QuestionSchema, name: SchemaNames.question },
  ];

  constructor(
    @InjectModel(SchemaNames.question)
    private readonly questionModel: Model<QuestionDocument>,
  ) {}

  public async createQuestion(
    answer: QuestionModel,
    question: QuestionModel,
    conversaion: ConversationDocment,
    audioUrl: string,
    evaluation: GrammerEvaluationVO,
    pronounciation_evaluation_vo: PronounciationEvaluationVo,
  ): Promise<QuestionDocument> {
    try {
      const q = await this.questionModel.create([
        {
          conversation: conversaion,
          question: question.content,
          original_answer: answer.content,
          question_prompt_at: question.date_time,
          answer_submitted_at: answer.date_time,
          answer_audio_file_url: audioUrl,
          corrected_answer: evaluation?.corrected_answer,
          paraphrased_answer: evaluation?.paraphrased_answer,
          understand_question: evaluation?.understand_question,
          is_answer_valid: evaluation?.is_answer_valid,
          reason_for_invalidity: evaluation?.reason_for_invalidity,
          grammar_errors_found: evaluation?.grammar_errors_found,
          pronunciation_score: pronounciation_evaluation_vo?.score,
          en_US: pronounciation_evaluation_vo?.en_US,
          en_UK: pronounciation_evaluation_vo?.en_UK,
          en_AU: pronounciation_evaluation_vo?.en_AU,
          ielts: pronounciation_evaluation_vo?.ielts,
          toefl: pronounciation_evaluation_vo?.toefl,
          pte_general: pronounciation_evaluation_vo?.pte_general,
          words: pronounciation_evaluation_vo?.words,
        },
      ]);
      return q[0];
    } catch (e) {
      return null;
    }
  }

  public async updateQuestion(
    question: QuestionDocument,
    evaluation: GrammerEvaluationVO,
  ) {
    try {
      return await this.questionModel.findByIdAndUpdate(
        question._id,
        {
          corrected_answer: evaluation.corrected_answer,
          paraphrased_answer: evaluation.paraphrased_answer,
          understand_question: evaluation.understand_question,
          is_answer_valid: evaluation.is_answer_valid,
          reason_for_invalidity: evaluation.reason_for_invalidity,
          grammar_errors_found: evaluation.grammar_errors_found,
        },
        { new: true },
      );
    } catch (e) {
      console.log(e);
    }
  }
}
