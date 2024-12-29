import { IsInt, IsOptional, IsString, Min } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class FetchPharmaceuticalFormDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'The page number for pagination. Must be an integer greater than or equal to 1.',
    default: 1,
  })
  @IsOptional()
  @IsInt({ message: 'Page must be an integer.' })
  @Min(1, { message: 'Page must be at least 1.' })
  @Type(() => Number)
  page: number = 1

  @ApiPropertyOptional({
    example: 'search-term',
    description: 'The query string for filtering results.',
    default: '',
  })
  @IsOptional()
  @IsString({ message: 'Query must be a string.' })
  query?: string = ''
}
