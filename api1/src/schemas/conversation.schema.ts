import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';
import { SchemaNames } from 'src/constants/schema.names';
import { ConversationMode } from 'src/enums/conversation.mode';

export type ConversationDocment = Conversation & Document;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Conversation {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SchemaNames.user,
    required: true,
  })
  user: ObjectId;

  @Prop({
    type: SchemaTypes.Array,
    default: [],
    ref: SchemaNames.question,
  })
  questions: Array<ObjectId>;

  /// ConversationTypeEnum
  @Prop({
    type: SchemaTypes.Number,
    required: true,
  })
  type: number;

  @Prop({
    type: SchemaTypes.Number,
    required: true,
    default: ConversationMode.test,
  })
  mode: number;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SchemaNames.topic,
    required: true,
  })
  topic: ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SchemaNames.subTopics,
    required: true,
  })
  sub_topic: ObjectId;

  @Prop({
    type: SchemaTypes.Date,
  })
  ended_at: Date;

  @Prop({
    type: SchemaTypes.Number,
    required: false,
    default: null,
  })
  fluency_and_coherence: number;

  @Prop({
    type: SchemaTypes.Number,
    required: false,
    default: null,
  })
  lexical_resource: number;

  @Prop({
    type: SchemaTypes.Number,
    required: false,
    default: null,
  })
  grammatical_range_and_accuracy: number;

  @Prop({
    type: SchemaTypes.Number,
    required: false,
    default: null,
  })
  pronunciation: number;

  @Prop({
    type: SchemaTypes.Array,
    default: [],
  })
  advices: Array<string>;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
