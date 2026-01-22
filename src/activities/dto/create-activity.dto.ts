import { IsNumber, IsString, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum ActivityType {
  MEETING_PARTICIPATION = 'meeting_participation',
  DOCUMENT_SUBMISSION = 'document_submission',
  LOGIN = 'login',
  LOGOUT = 'logout',
}

export class CreateActivityDto {
  @IsEnum(ActivityType)
  type: string;

  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsNumber()
  userId: number;

  @IsString()
  data: string;
}