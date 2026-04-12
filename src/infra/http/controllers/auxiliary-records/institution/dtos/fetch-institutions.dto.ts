import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsNumber, Min, IsBoolean } from 'class-validator'
import { Type, Transform } from 'class-transformer'

export class FetchInstitutionsDto {
  @ApiProperty({
    description: 'Filtro de busca para as instituições',
    example: 'hospital',
    required: false,
  })
  @IsOptional()
  @IsString()
  query?: string

  @ApiProperty({
    description: 'Filtro de busca para as instituições',
    example: '11111222223333',
    required: false,
  })
  @IsOptional()
  @IsString()
  cnpj?: string

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
    description: 'Filtro de busca para as instituições que controlam estoque',
    example: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  controlStock?: boolean
}
