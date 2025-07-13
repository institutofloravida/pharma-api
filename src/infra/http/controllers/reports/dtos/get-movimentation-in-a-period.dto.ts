import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ExitType } from '@/domain/pharma/enterprise/entities/exit'
import { MovementDirection } from '../../auxiliary-records/movement-type/dtos/create-movement-type.dto'

export class GetMovimentationInAPeriodDto {
  @ApiProperty({
    example: 'f7e2b46b-8b21-4e58-bf0f-9c9470fd0a66',
    description: 'ID da instituição onde a dispensação ocorreu.',
  })
  @IsString({ message: 'O ID da instituição deve ser uma string.' })
  institutionId: string

  @ApiProperty({
    example: '2024-01-01',
    description: 'Data inicial do período da consulta. Deve estar no formato ISO 8601 (YYYY-MM-DD).',
  })
  @Type(() => Date)
  @IsDate({ message: 'A data inicial deve ser uma data válida.' })
  startDate: Date

  @ApiProperty({
    example: '2024-01-31',
    description: 'Data final do período da consulta. Deve estar no formato ISO 8601 (YYYY-MM-DD).',
  })
  @Type(() => Date)
  @IsDate({ message: 'A data final deve ser uma data válida.' })
  endDate: Date

  @ApiPropertyOptional({
    example: '4a8cfc56-6d7d-4e89-a548-abb4f0a5a0cb',
    description: 'ID do operador responsável pela dispensação.',
  })
  @IsOptional()
  @IsString({ message: 'O ID do operador deve ser uma string.' })
  operatorId?: string

  @ApiPropertyOptional({
    example: 'f30579b4-d4d9-46f8-9e59-645d45df1ab3',
    description: 'ID do medicamento para filtrar as movimentações.',
  })
  @IsOptional()
  @IsString({ message: 'O ID do medicamento deve ser uma string.' })
  medicineId?: string

  @ApiPropertyOptional({
    example: 'f30579b4-d4d9-46f8-9e59-645d45df1ab3',
    description: 'ID da variante para filtrar as movimentações.',
  })
  @IsOptional()
  @IsString({ message: 'O ID da variante deve ser uma string.' })
  medicineVariantId?: string

  @ApiPropertyOptional({
    example: 'f30579b4-d4d9-46f8-9e59-645d45df1ab3',
    description: 'ID do estoque para filtrar as movimentações.',
  })
  @IsOptional()
  @IsString({ message: 'O ID do estoque deve ser uma string.' })
  stockId?: string

  @ApiPropertyOptional({
    example: 'f30579b4-d4d9-46f8-9e59-645d45df1ab3',
    description: 'ID do medicamento em estoque para filtrar as movimentações.',
  })
  @IsOptional()
  @IsString({ message: 'O ID do medicamento em estoque deve ser uma string.' })
  medicineStockId?: string

  @ApiPropertyOptional({
    example: 'f30579b4-d4d9-46f8-9e59-645d45df1ab3',
    description: 'ID do lote para filtrar as movimentações.',
  })
  @IsOptional()
  @IsString({ message: 'O ID do lote deve ser uma string.' })
  batchStockId?: string

  @ApiPropertyOptional({
    example: 'f30579b4-d4d9-46f8-9e59-645d45df1ab3',
    description: 'ID do tipo de moviementação para filtrar as movimentações.',
  })
  @IsOptional()
  @IsString({ message: 'O ID do tipo de moviementação deve ser uma string.' })
  movementTypeId?: string

  @ApiPropertyOptional({
    example: 30,
    description: 'quantidade da movimentação para filtrar as movimentações.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  quantity?: number

  @ApiPropertyOptional({
    example: 'DONATION',
    description: 'Tipo de saída',
    enum: ExitType,
  })
  @IsEnum(ExitType)
  @IsOptional()
  exitType?: ExitType

  @ApiProperty({ example: MovementDirection.ENTRY, enum: MovementDirection })
  @IsEnum(MovementDirection)
  @IsOptional()
  direction?: MovementDirection
}
