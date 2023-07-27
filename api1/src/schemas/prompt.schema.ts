import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";
import { PromptTypeEnum } from "src/enums/prompt.type";

export type PromptDocument = Prompt & Document;

@Schema({
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
})
export class Prompt {
  @Prop({
    type : SchemaTypes.Number,
    required : true,
    enum : PromptTypeEnum,
    unique : true,
    index : true
  })
  type : number;

  @Prop({
    type : SchemaTypes.String,
    required : true
  })
  prompt : string;
}

export const PromptSchema = SchemaFactory.createForClass(Prompt);