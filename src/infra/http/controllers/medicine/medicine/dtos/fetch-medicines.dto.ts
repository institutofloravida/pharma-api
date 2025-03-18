import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsNumber, Min, IsArray } from 'class-validator'
import { Transform, Type } from 'class-transformer'

export class FetchMedicinesDto {
  @ApiProperty({
    description: 'Filtro de busca para os medicamentos',
    example: 'ABCDE1',
    required: false,
  })
  @IsOptional()
  @IsString()
  query?: string

  @ApiProperty({
    description: 'Número da página para a listagem',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1

  @ApiProperty({
    description: 'IDs das classes terapeuticas para filtrar os medicamentos',
    example: ['id1', 'id2', 'id3'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value)
    ? value
    : [value]))
  @IsString({ each: true })
  therapeuticClassesIds?: string[]
}
