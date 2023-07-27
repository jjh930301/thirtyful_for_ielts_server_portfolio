import { PipelineStage } from 'mongoose';

export class SelectHelper {
  static user = {
    _id: 1,
    email: {
      $ifNull: ['$email', null],
    },
    display_name: {
      $ifNull: ['$display_name', null],
    },
    profile_image_url: {
      $ifNull: ['$profile_image_url', null],
    },
    type: {
      $ifNull: ['$type', 0],
    },
    conversations: 1,
  };

  static question_project = {
    question: 1,
    original_answer: 1,
    corrected_answer: 1,
    paraphrased_answer: 1,
    understand_question: 1,
    answer_audio_file_url: 1,
    is_answer_valid: 1,
    reason_for_invalidity: 1,
    grammar_errors_found: 1,
    pronunciation_score: 1,
    ielts: 1,
  };
}
