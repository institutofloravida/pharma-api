import { IsString, IsISO8601 } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class FetchDispensesPerDayDto {
  @ApiProperty({
    description: 'ID da instituição',
    example: '12345',
    required: true,
  })
  @IsString()
  institutionId: string

  @ApiProperty({
    description: 'Data início',
    example: '2025-12-01T03:00:00.000Z',
  })
  @IsISO8601({ strict: true })
  startDate: string

  @ApiProperty({
    description: 'Data fim',
    example: '2025-12-20T03:00:00.000Z',
  })
  @IsISO8601({ strict: true })
  endDate: string
}
