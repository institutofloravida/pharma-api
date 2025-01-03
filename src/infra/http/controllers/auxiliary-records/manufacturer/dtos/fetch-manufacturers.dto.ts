import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsNumber, Min, MaxLength } from 'class-validator'
import { Type } from 'class-transformer'

export class FetchManufacturersDto {
  @ApiProperty({
    description: 'Filtro de busca para os fabricantes',
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
    description: 'CNPJ do fabricante para filtrar',
    example: '12345678000195',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(14, { message: 'O CNPJ deve ter no máximo 14 caracteres' })
  cnpj?: string
}
