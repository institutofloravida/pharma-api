import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsNumber, Min, IsArray } from 'class-validator'
import { Type } from 'class-transformer'

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
    description: 'Lista de IDs das instituições para filtro',
    example: ['123e4567-e89b-12d3-a456-426614174000', '456e1237-e89b-34d3-a789-426614178900'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  institutionsIds?: string[]
}
