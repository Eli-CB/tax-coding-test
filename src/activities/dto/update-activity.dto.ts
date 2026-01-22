import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ActivityType } from './create-activity.dto';

export class UpdateActivityDto {
    @IsOptional()
    @IsEnum(ActivityType)
    type?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    date?: Date;

    @IsOptional()
    @IsNumber()
    userId?: number;

    @IsOptional()
    @IsString()
    data?: string;
}
