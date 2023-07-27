import { Injectable } from "@nestjs/common";
import { InjectModel, ModelDefinition } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SchemaNames } from "src/constants/schema.names";
import { PromptDocument, PromptSchema } from "src/schemas/prompt.schema";
import { CreatePromptDto } from "../admin/dto/create.prompt.dto";

@Injectable()
export class PromptProvider {
  static models : ModelDefinition[] = [
    { name: SchemaNames.prompt, schema: PromptSchema },
  ];

  constructor(
    @InjectModel(SchemaNames.prompt)
    private readonly promptModel : Model<PromptDocument>
  ){}

  public async findByType(type : number) {
    try {
      return await this.promptModel.findOne({
        type : type
      })
    } catch(e) {
      return null;
    }
  }

  public async upsert(body : CreatePromptDto) : Promise<PromptDocument> {
    try {
      return await this.promptModel.findOneAndUpdate(
        {
          type : body.type,
          prompt : body.prompt
        },
        {
          type : body.type,
          prompt : body.prompt
        },
        {
          new : true,
          upsert : true,
        }
      )
    } catch(e) {
      return null;
    }
  }

  public async find() : Promise<Array<PromptDocument>> {
    try {
      return await this.promptModel.find();
    } catch(e) {
      return null;
    }
  }
}