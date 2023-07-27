import { Injectable } from '@nestjs/common';
import { InjectModel, ModelDefinition } from '@nestjs/mongoose';
import { isNumber, IsNumber } from 'class-validator';
import { FilterQuery, Model, Types } from 'mongoose';
import { SchemaNames } from 'src/constants/schema.names';
import {
  ConversationDocment,
  ConversationSchema,
} from 'src/schemas/conversation.schema';
import { QuestionDocument } from 'src/schemas/question.schema';
import { ConversationDto } from '../topic/dto/conversation.dto';
import { PaginationDto } from '../user/dto/pagination.dto';
import { ScoreEvaluationVO } from '../topic/vo/score_evaluation.vo';
import { TopicDocument, TopicSchema } from 'src/schemas/topic.schema';
import { SubTopicDocument, SubTopicSchema } from 'src/schemas/sub_topic.schema';
import { SelectHelper } from 'src/helpers/select.helper';

@Injectable()
export class ConversationProvider {
  static models: ModelDefinition[] = [
    { schema: ConversationSchema, name: SchemaNames.conversation },
    { schema: TopicSchema, name: SchemaNames.topic },
    { schema: SubTopicSchema, name: SchemaNames.subTopics },
  ];
  constructor(
    @InjectModel(SchemaNames.conversation)
    private readonly converationModel: Model<ConversationDocment>,
    @InjectModel(SchemaNames.topic)
    private readonly topicModel: Model<TopicDocument>,
    @InjectModel(SchemaNames.subTopics)
    private readonly subTopicModel: Model<SubTopicDocument>,
  ) {}

  public async findById(conversation_id: string) {
    try {
      return await this.converationModel
        .findById(conversation_id)
        .populate('questions');
    } catch (e) {
      return null;
    }
  }

  public async createConversation(
    userId: string,
    type: number,
    data: ConversationDto,
  ): Promise<ConversationDocment> {
    try {
      const topic = await this.topicModel.findOne({
        name: data.topic,
      });

      const subTopic = await this.subTopicModel.findOne({
        name: data.sub_topic,
      });

      const conversation = await this.converationModel.create([
        {
          user: new Types.ObjectId(userId),
          type: type,
          topic: topic,
          sub_topic: subTopic,
          mode: data.mode,
        },
      ]);

      return conversation[0];
    } catch (e) {
      return null;
    }
  }

  public async pushQuestion(
    conversation: ConversationDocment,
    question: QuestionDocument,
  ) {
    try {
      return await this.converationModel.findByIdAndUpdate(conversation._id, {
        $push: {
          questions: question._id,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  public async getExamSummary(user_id: string) {
    try {
      const summary = await this.converationModel.aggregate([
        {
          $match: {
            user: new Types.ObjectId(user_id),
            mode: 0,
          },
        },
        {
          $group: {
            _id: null,

            fluency_and_coherence: {
              $avg: '$fluency_and_coherence',
            },
            lexical_resource: {
              $avg: '$lexical_resource',
            },
            grammatical_range_and_accuracy: {
              $avg: '$grammatical_range_and_accuracy',
            },
            pronunciation: {
              $avg: '$pronunciation',
            },
            count: {
              $sum: 1,
            },
            last_date: {
              $last: '$created_at',
            },
          },
        },
        {
          $project: {
            _id: 0,
            fluency_and_coherence: {
              $cond: {
                if: { $eq: ['$fluency_and_coherence', null] },
                then: null,
                else: { $round: ['$fluency_and_coherence', 1] },
              },
            },
            lexical_resource: {
              $cond: {
                if: { $eq: ['$lexical_resource', null] },
                then: null,
                else: { $round: ['$lexical_resource', 1] },
              },
            },
            grammatical_range_and_accuracy: {
              $cond: {
                if: { $eq: ['$grammatical_range_and_accuracy', null] },
                then: null,
                else: { $round: ['$grammatical_range_and_accuracy', 1] },
              },
            },
            pronunciation: {
              $cond: {
                if: { $eq: ['$pronunciation', null] },
                then: null,
                else: { $round: ['$pronunciation', 1] },
              },
            },
            count: {
              $cond: {
                if: { $eq: ['$count', null] },
                then: 0,
                else: '$count',
              },
            },
            last_date: {
              $cond: {
                if: { $eq: ['$last_date', null] },
                then: null,
                else: '$last_date',
              },
            },
          },
        },
      ]);
      return summary.length == 0 ? null : summary[0];
    } catch (e) {
      console.error(e);
    }
  }

  public async aggregateById(
    conversationId: string,
  ): Promise<ConversationDocment> {
    try {
      const aggregate = await this.converationModel.aggregate([
        {
          $match: {
            _id: new Types.ObjectId(conversationId),
          },
        },

        {
          $lookup: {
            from: SchemaNames.question,
            localField: 'questions',
            foreignField: '_id',
            as: 'questions',
            pipeline: [
              {
                $project: SelectHelper.question_project,
              },
            ],
          },
        },
        {
          $lookup: {
            from: SchemaNames.topic,
            localField: 'topic',
            foreignField: '_id',
            as: 'topic',
            pipeline: [
              {
                $project: {
                  name: 1,
                },
              },
              {
                $unwind: '$name',
              },
            ],
          },
        },

        {
          $lookup: {
            from: SchemaNames.subTopics,
            localField: 'sub_topic',
            foreignField: '_id',
            as: 'sub_topic',
            pipeline: [
              {
                $project: {
                  name: 1,
                },
              },
              {
                $unwind: '$name',
              },
            ],
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
        {
          $project: {
            _id: 1,
            mode: 1,
            type: 1,
            topic: '$topic.name',
            sub_topic: '$sub_topic.name',
            created_at: 1,
            updated_at: 1,
            questions: 1,
            fluency_and_coherence: 1,
            lexical_resource: 1,
            grammatical_range_and_accuracy: 1,
            advices: 1,
            pronunciation: 1,
          },
        },
        {
          $unwind: {
            path: '$topic',
          },
        },
        {
          $unwind: {
            path: '$sub_topic',
          },
        },
      ]);
      return aggregate[0];
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  public async findByUserId(
    userId: string,
    query: PaginationDto,
  ): Promise<Array<ConversationDocment>> {
    const mode = Number(query.mode);
    try {
      const filter: FilterQuery<any>[] = [];
      filter.push({ user: new Types.ObjectId(userId) });
      if (isNumber(mode)) {
        filter.push({
          mode: mode,
          $nor: [{ fluency_and_coherence: null }],
        });
      }

      return await this.converationModel.aggregate([
        {
          $match: {
            $and: filter,
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },

        {
          $lookup: {
            from: SchemaNames.question,
            localField: 'questions',
            foreignField: '_id',
            as: 'questions',
            pipeline: [
              {
                $project: SelectHelper.question_project,
              },
            ],
          },
        },
        {
          $lookup: {
            from: SchemaNames.topic,
            localField: 'topic',
            foreignField: '_id',
            as: 'topic',
            pipeline: [
              {
                $project: {
                  name: 1,
                },
              },
              {
                $unwind: '$name',
              },
            ],
          },
        },
        {
          $lookup: {
            from: SchemaNames.subTopics,
            localField: 'sub_topic',
            foreignField: '_id',
            as: 'sub_topic',
            pipeline: [
              {
                $project: {
                  name: 1,
                },
              },
              {
                $unwind: '$name',
              },
            ],
          },
        },
        {
          $skip:
            Number(query.page) === 0
              ? 0
              : (Number(query.page) - 1) * Number(query.count),
        },
        {
          $limit: Number(query.count),
        },
        {
          $project: {
            _id: 1,
            mode: 1,
            type: 1,
            topic: '$topic.name',
            sub_topic: '$sub_topic.name',
            created_at: 1,
            updated_at: 1,
            questions: 1,
            fluency_and_coherence: 1,
            lexical_resource: 1,
            grammatical_range_and_accuracy: 1,
            advices: 1,
            pronunciation: 1,
          },
        },
        {
          $unwind: {
            path: '$topic',
          },
        },
        {
          $unwind: {
            path: '$sub_topic',
          },
        },
      ]);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  /// 기존 Conversation에 Evaluation값들을 업데이트 한다.
  public async updateConversation(
    conversation: ConversationDocment,
    scoreEvaluation: ScoreEvaluationVO,
    pronunciation: number,
  ) {
    try {
      await this.converationModel.findByIdAndUpdate(
        conversation._id,
        {
          fluency_and_coherence: scoreEvaluation.fluency_and_coherence,
          lexical_resource: scoreEvaluation.lexical_resource,
          grammatical_range_and_accuracy:
            scoreEvaluation.grammatical_range_and_accuracy,
          advices: scoreEvaluation.advices,
          pronunciation: pronunciation,
        },
        {
          new: true,
        },
      );

      return this.aggregateById(conversation._id);
    } catch (e) {
      console.log(e);
    }
  }
}
