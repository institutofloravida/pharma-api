import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, Min } from 'class-validator'
import { Transform } from 'class-transformer'

export class FetchMedicinesEntriesQueryParamsDto {
  @ApiProperty({
    description: 'ID da instituição',
    example: 'institution123',
  })
  @IsString()
  institutionId: string

  @ApiProperty({
    description: 'ID do medicamento (opcional)',
    example: 'medicine123',
    required: false,
  })
  @IsOptional()
  @IsString()
  medicineId?: string

  @ApiProperty({
    description: 'ID da variante do medicamento (opcional)',
    example: 'medicineVariant123',
    required: false,
  })
  @IsOptional()
  @IsString()
  medicineVariantId?: string

  @ApiProperty({
    description: 'ID do estoque (opcional)',
    example: 'stock123',
    required: false,
  })
  @IsOptional()
  @IsString()
  stockId?: string

  @ApiProperty({
    description: 'ID do operador (opcional)',
    example: 'operator123',
    required: false,
  })
  @IsOptional()
  @IsString()
  operatorId?: string

  @ApiProperty({
    description: 'Número da página para a consulta',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => Number(value) || 1)
  page: number = 1
}
