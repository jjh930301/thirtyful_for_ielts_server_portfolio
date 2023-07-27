import { Injectable } from '@nestjs/common';
import { InjectModel, ModelDefinition } from '@nestjs/mongoose';
import { ClientSession, Model, ObjectId, Types } from 'mongoose';
import { SchemaNames } from 'src/constants/schema.names';
import { SelectHelper } from 'src/helpers/select.helper';
import { User, UserDocument, UserSchema } from 'src/schemas/user.schema';
import { RegistUserDto } from '../auth/dto/regist.user.dto';

@Injectable()
export class UserProvider {
  static models: Array<ModelDefinition> = [
    { schema: UserSchema, name: SchemaNames.user },
  ];
  constructor(
    @InjectModel(SchemaNames.user)
    private readonly userModel: Model<User>,
  ) {}

  public async findByKey(key: string, value): Promise<UserDocument> {
    try {
      if (key === '_id') {
        value = new Types.ObjectId(value);
      }
      const user = await this.userModel.aggregate([
        {
          $match: {
            [key]: value,
          },
        },
        {
          $project: SelectHelper.user,
        },
      ]);
      return user[0];
    } catch (e) {
      return null;
    }
  }

  public async findByIdAndUpdate(
    id: string,
    key: string,
    value,
  ): Promise<UserDocument> {
    try {
      return await this.userModel.findByIdAndUpdate(
        id,
        {
          [key]: value,
        },
        {
          new: true,
        },
      );
    } catch (e) {
      return null;
    }
  }

  public async createUser(
    data: RegistUserDto,
    session: ClientSession,
  ): Promise<UserDocument> {
    try {
      const user = await this.userModel.create(
        [
          {
            display_name: data.display_name,
            email: data.email,
            profile_image_url: data.profile_image_url,
            operating_system: data.type,
            type: 1,
          },
        ],
        { session: session },
      );
      return user[0];
    } catch (e) {
      return null;
    }
  }
}
