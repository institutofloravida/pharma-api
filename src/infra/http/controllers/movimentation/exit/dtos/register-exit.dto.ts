import { ExitType } from '@/domain/pharma/enterprise/entities/exit'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsUUID,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator'

export class RegisterExitDto {
  @ApiProperty({ example: 'f5d0b1b2-62c5-4d0c-8b5e-8d50e3df7b7e', description: 'ID do estoque do medicamento' })
  @IsUUID()
  medicineStockId: string

  @ApiProperty({ example: 'a88cda3f-cf1a-42a5-995d-e0b9480f6d3f', description: 'ID do lote do estoque' })
  @IsUUID()
  batcheStockId: string

  @ApiProperty({ example: 10, description: 'Quantidade de itens a serem retirados' })
  @IsNumber()
  @Min(1)
  quantity: number

  @ApiProperty({
    example: 'DONATION',
    description: 'Tipo de saída',
    enum: ExitType,
  })
  @IsEnum(ExitType)
  exitType: ExitType

  @ApiProperty({ example: '75e5b24b-bf1b-4a1d-b0d5-cfcba1e587e1', description: 'ID do tipo de movimentação' })
  @IsUUID()
  movementTypeId: string

  @ApiProperty({
    example: '2025-05-07T12:00:00.000Z',
    description: 'Data da saída',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  exitDate?: Date
}
