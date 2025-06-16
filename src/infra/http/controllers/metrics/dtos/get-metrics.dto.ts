import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class GetMetricsDto {
  @ApiProperty({
    description: 'id da instituição',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: true,
  })
  @IsString()
  institutionId: string
}
