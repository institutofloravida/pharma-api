import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsNumber, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class FetchBatchesDto {
  @ApiProperty({
    description: 'Filtro de busca para os lotes',
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
}
