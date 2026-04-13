import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsOptional, IsString } from 'class-validator'

export class UpdateBatchDto {
  @ApiProperty({
    example: 'LOT-2024-001',
    description: 'Novo código do lote',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly code?: string

  @ApiProperty({
    example: '2026-12-31',
    description: 'Nova data de validade do lote',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  readonly expirationDate?: string

  @ApiProperty({
    example: '2024-01-15',
    description: 'Nova data de fabricação do lote',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  readonly manufacturingDate?: string
}
