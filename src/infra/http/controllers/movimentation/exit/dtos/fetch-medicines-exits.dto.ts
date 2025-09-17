import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsISO8601,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ExitType } from '@/domain/pharma/enterprise/entities/exit';

export class FetchMedicinesExitsDto {
  @ApiProperty({
    description: 'ID da instituição',
    example: 'institution123',
  })
  @IsString()
  institutionId: string;

  @ApiPropertyOptional({
    description: 'ID do operador (opcional)',
    example: 'operator123',
    required: false,
  })
  @IsOptional()
  @IsString()
  operatorId?: string;

  @ApiPropertyOptional({
    example: 'DONATION',
    description: 'Tipo de saída',
    enum: ExitType,
  })
  @IsEnum(ExitType)
  @IsOptional()
  exitType: ExitType;

  @ApiPropertyOptional({
    description: 'Data da saída',
    example: '2025-12-01T03:00:00.000Z',
  })
  @IsISO8601({ strict: true })
  @IsOptional()
  exitDate?: string;

  @ApiProperty({
    description: 'Número da página para a consulta',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => Number(value) || 1)
  page: number = 1;
}
