import { ExitType } from '@/domain/pharma/enterprise/entities/exit'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsUUID,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
  Min,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator'
import { Type } from 'class-transformer'

class BatchExitDto {
  @ApiProperty({ example: 'a88cda3f-cf1a-42a5-995d-e0b9480f6d3f', description: 'ID do lote do estoque' })
  @IsUUID()
  batcheStockId: string

  @ApiProperty({ example: 10, description: 'Quantidade de itens a serem retirados' })
  @IsNumber()
  @Min(1)
  quantity: number
}

export class RegisterExitDto {
  @ApiProperty({
    type: [BatchExitDto],
    description: 'Array de lotes a serem retirados',
    example: [{ batcheStockId: 'a88cda3f-cf1a-42a5-995d-e0b9480f6d3f', quantity: 5 }],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BatchExitDto)
  batches: BatchExitDto[]

  @ApiProperty({ example: 'f5d0b1b2-62c5-4d0c-8b5e-8d50e3df7b7e', description: 'ID do estoque de medicamento' })
  @IsUUID()
  stockId: string

  @ApiProperty({
    example: 'DONATION',
    description: 'Tipo de saída',
    enum: ExitType,
  })
  @IsEnum(ExitType)
  exitType: ExitType

  @ApiPropertyOptional({ example: '75e5b24b-bf1b-4a1d-b0d5-cfcba1e587e1', description: 'ID do tipo de movimentação' })
  @IsUUID()
  @IsOptional()
  movementTypeId?: string

  @ApiProperty({
    example: '2025-05-07T12:00:00.000Z',
    description: 'Data da saída',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  exitDate?: Date
}
