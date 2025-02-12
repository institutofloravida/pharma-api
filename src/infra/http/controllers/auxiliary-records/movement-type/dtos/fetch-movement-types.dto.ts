import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString, IsIn, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { MovementDirection } from '@/domain/pharma/enterprise/entities/movement-type' // Importando do domínio

export class FetchMovementTypesDto {
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

  @ApiPropertyOptional({
    example: 'ENTRY',
    description: 'Direção do tipo de movimentação (ENTRY ou EXIT)',
  })
  @IsOptional()
  @IsString()
  @IsIn(['ENTRY', 'EXIT']) // Garante que seja apenas 'ENTRY' ou 'EXIT'
  direction?: MovementDirection

  @ApiPropertyOptional({
    example: 'DOAÇÃO',
    description: 'Filtro pelo conteúdo do tipo de movimentação',
  })
  @IsOptional()
  @IsString()
  query?: string
}
