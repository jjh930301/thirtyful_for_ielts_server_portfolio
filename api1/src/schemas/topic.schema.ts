import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';
import { SchemaNames } from 'src/constants/schema.names';

export type TopicDocument = Topic & Document;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Topic {
  /// 스피킹 파트
  @Prop({
    type: SchemaTypes.Number,
    required: true,
  })
  part: number;

  /// 상태 0 : 비활성화 | 1 : 활성화
  @Prop({
    type: SchemaTypes.Number,
    required: true,
    defualt: 1,
  })
  status: number;

  /// 토픽 이름
  @Prop({
    type: SchemaTypes.String,
    required: true,
  })
  name: string;

  /// 서브토픽
  @Prop({
    type: SchemaTypes.Array,
    default: [],
    ref: SchemaNames.subTopics,
  })
  sub_topics: Array<ObjectId>;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
