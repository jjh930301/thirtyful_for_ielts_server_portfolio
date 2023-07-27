
export class Constants {
  static ENV = process.env.ENV;
  static ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
  static REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
  static OPEN_AI_KEY = process.env.OPEN_AI_TOKEN
  static S3_ACCESS_KEY = process.env.S3_ACCESS_KEY
  static S3_SECRET_KEY = process.env.S3_SECRET_KEY
  static S3_BUCKET = process.env.S3_BUCKET
}
