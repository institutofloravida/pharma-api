import { IsInt, IsOptional, Min } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class FetchUnitsMeasureDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'The page number for pagination. Must be an integer greater than or equal to 1.',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer.' })
  @Min(1, { message: 'Page must be at least 1.' })
  page: number = 1
}
