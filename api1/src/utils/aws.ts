import {S3} from 'aws-sdk';
import fs from 'fs';
import { Constants } from 'src/constants/constants';

export class AwsUtil {

  private s3 : S3

  constructor(){
    this.s3 = new S3({
      accessKeyId : Constants.S3_ACCESS_KEY,
      secretAccessKey : Constants.S3_SECRET_KEY
    })
  }

  insertImages(
    images : Array<Express.Multer.File> , 
    type : string,
    user_id : string
  ) {
    const obj : Object = {};
    const arr : Array<string> = [];
    images.forEach((image) => {
      const param = {
        Bucket : Constants.S3_BUCKET,
        Key : `${user_id}/${type}/${Date.now()}`,
        Body : image["buffer"],
        ContentType : image["mimetype"]
      }
      const aws_image = this.s3.upload(param , (err , data) => {
        if(!err) {
          return data
        }
      })
      const https = "https://";
      const host = aws_image["singlePart"]["httpRequest"]["endpoint"]["hostname"];
      const endPoint = aws_image["singlePart"]["httpRequest"]["path"]
      if(image.fieldname === 'etc_image_urls') {
        arr.push(`${https}${host}${endPoint}`)
      } 
      obj[image.fieldname] = `${https}${host}${endPoint}`
    })
    if(obj.hasOwnProperty('etc_image_urls')) {
      obj['etc_image_urls'] = arr;
    }
    return obj
  }

  async uploadAudio(
    user_id : string,
    dir : string,
    audio : Express.Multer.File,
  ) {
    try {
      const param = {
        Bucket : process.env.S3_BUCKET,
        Key : `${user_id}/${dir}/${new Date().toISOString()}.mp3`,
        Body : audio["buffer"],
        ContentType : audio["mimetype"]
      }
      const aws_data = this.s3.upload(param , (err , data) => {
        if(!err) {
          return data
        }
      })
      if(aws_data) {
        const https = "https://";
        const host = aws_data["singlePart"]["httpRequest"]["endpoint"]["hostname"];
        const endPoint = aws_data["singlePart"]["httpRequest"]["path"]
        return `${https}${host}${endPoint}`
      }
      return ""
    } catch(e) {
      return null;
    }
  }
}