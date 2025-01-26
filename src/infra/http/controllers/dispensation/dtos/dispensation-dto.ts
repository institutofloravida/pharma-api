import { IsNotEmpty, IsUUID, IsArray, ValidateNested } from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class BatchStockDto {
  @ApiProperty({
    description: 'ID único do estoque do lote',
    example: 'e7b1c5e1-33b6-4d62-8f92-1e09f5d87a2f',
  })
  @IsUUID()
  @IsNotEmpty()
  batchStockId: string

  @ApiProperty({
    description: 'Quantidade disponível no lote',
    example: 100,
  })
  @IsNotEmpty()
  quantity: number
}

export class DispensationDto {
  @ApiProperty({
    description: 'ID único da variante do medicamento',
    example: 'f6c1cbe7-9df6-44f1-8c53-9835dbd479e1',
  })
  @IsUUID()
  @IsNotEmpty()
  medicineVariantId: string

  @ApiProperty({
    description: 'ID único do estoque',
    example: 'a4f89d2b-23de-4e8b-8b45-d1b67e5bc2b3',
  })
  @IsUUID()
  @IsNotEmpty()
  stockId: string

  @ApiProperty({
    description: 'ID único do paciente',
    example: 'b2c3d4e5-f6a7-48b9-8e1c-2d3456f78901',
  })
  @IsUUID()
  @IsNotEmpty()
  patientId: string

  @ApiProperty({
    description: 'Lista de estoques dos lotes envolvidos na dispensação',
    type: [BatchStockDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BatchStockDto)
  batchesStocks: BatchStockDto[]

  @ApiProperty({
    description: 'Data de dispensação',
    example: '2025-12-01',
  })
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  dispensationDate: Date
}
