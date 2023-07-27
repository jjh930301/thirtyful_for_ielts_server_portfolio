import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';
import { SchemaNames } from 'src/constants/schema.names';

export type SubTopicDocument = SubTopic & Document;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class SubTopic {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SchemaNames.topic,
    required: true,
  })
  topic: ObjectId;

  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  name: string;
}

export const SubTopicSchema = SchemaFactory.createForClass(SubTopic);
