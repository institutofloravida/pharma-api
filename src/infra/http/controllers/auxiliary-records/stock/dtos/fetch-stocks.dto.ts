import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsNumber, Min, IsArray } from 'class-validator'
import { Transform, Type } from 'class-transformer'

export class FetchStocksDto {
  @ApiProperty({
    description: 'Filtro de busca para os stocks',
    example: 'Stock 01',
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
    description: 'IDs das instituições para filtrar os stocks',
    example: ['id1', 'id2', 'id3'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value)
    ? value
    : [value]))
  @IsString({ each: true })
  institutionsIds?: string[]
}
