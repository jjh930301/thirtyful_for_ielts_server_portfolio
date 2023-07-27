import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';
import { SchemaNames } from 'src/constants/schema.names';

export type UserDocument = User & Document;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class User {
  @Prop({
    type: SchemaTypes.String,
    required: false,
    default: null,
  })
  email: string;

  @Prop({
    type: SchemaTypes.String,
    required: false,
    default: null,
  })
  display_name: string;

  @Prop({
    type: SchemaTypes.String,
    required: false,
    default: null,
  })
  profile_image_url: string;

  @Prop({
    type: SchemaTypes.Number,
    default: 0,
    required: true,
  })
  type: number; // 0 : 탈퇴 | 1 : 일반

  @Prop({
    type: SchemaTypes.Number,
    required: false,
  })
  operating_system: number; // 1 : google | 2 : apple

  @Prop({
    type: SchemaTypes.String,
    required: false,
    default: null,
  })
  refresh_token: string;

  @Prop({
    type: SchemaTypes.Array,
    default: [],
    ref: SchemaNames.conversation,
  })
  conversations: Array<ObjectId>;
}

export const UserSchema = SchemaFactory.createForClass(User);
