import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MissionCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '헬스',
    description: '미션 카테고리 이름'
  })
  public name: string;
}

export class CompleteMissionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '',
    description: '',
    required: true,
  })
  public date: string;
}
