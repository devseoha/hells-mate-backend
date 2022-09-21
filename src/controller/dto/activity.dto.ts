import { IsDate, isNotEmpty, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PointsDateRangeDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
    description: '그룹 Id',
    required: true,
  })
  public groupId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '20220901',
    description: '시작날짜 (inclusive)',
    required: true,
  })
  public startDate: string;
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '20220907',
    description: '종료날짜 (inclusive)',
    required: true,
  })
  public endDate: string;
  
}
