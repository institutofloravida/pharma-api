import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, Min, IsISO8601 } from 'class-validator'
import { Transform } from 'class-transformer'

export class FetchMedicinesExitsDto {
  @ApiProperty({
    description: 'ID da instituição',
    example: 'institution123',
  })
  @IsString()
  institutionId: string

  @ApiPropertyOptional({
    description: 'ID do medicamento (opcional)',
    example: 'medicine123',
    required: false,
  })
  @IsOptional()
  @IsString()
  medicineId?: string

  @ApiPropertyOptional({
    description: 'ID do operador (opcional)',
    example: 'operator123',
    required: false,
  })
  @IsOptional()
  @IsString()
  operatorId?: string

  @ApiPropertyOptional({
    description: 'lote do medicamento',
    example: 'ABC01',
    required: false,
  })
  @IsOptional()
  @IsString()
  batch?: string

  @ApiPropertyOptional({
    description: 'ID do tipo de movimento (opcional)',
    example: 'movemenType123',
    required: false,
  })
  @IsOptional()
  @IsString()
  movementTypeId?: string

  @ApiPropertyOptional({
    description: 'Data da saída',
    example: '2025-12-01T03:00:00.000Z',
  })
  @IsISO8601({ strict: true })
  @IsOptional()
  exitDate?: string

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
