import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, IsInt, Min, IsString } from 'class-validator'

export class FetchMedicinesStockDto {
  @ApiProperty({
    example: 1,
    description:
      'The page number for pagination. Must be an integer greater than or equal to 1.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer.' })
  @Min(1, { message: 'Page must be at least 1.' })
  page: number = 1

  @ApiProperty({ example: 'abc123', description: 'ID do estoque' })
  @IsString()
  stockId: string

  @ApiPropertyOptional({ example: 'Paracetamol', description: 'Nome do medicamento para filtro opcional' })
  @IsOptional()
  @IsString()
  medicineName?: string
}
