import { IsInt, IsOptional, IsString, Min } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class FetchMedicinesVariantsDto {
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

  @ApiPropertyOptional({
    example: '',
    description: 'Optional query string to filter results.',
    default: '',
  })
  @IsOptional()
  @IsString({ message: 'Query must be a string.' })
  query?: string = ''

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the medicine to filter results.',
  })
  @IsString({ message: 'Medicine ID must be a string.' })
  @IsOptional()
  medicineId?: string
}
