import { IsNotEmpty, IsUUID, IsArray, ValidateNested, IsISO8601 } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class BatchStockDto {
  @IsUUID()
  @IsNotEmpty()
  batchStockId: string

  @IsNotEmpty()
  quantity: number
}

export class DispensationDto {
  @IsUUID()
  @IsNotEmpty()
  medicineVariantId: string

  @IsUUID()
  @IsNotEmpty()
  stockId: string

  @IsUUID()
  @IsNotEmpty()
  patientId: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BatchStockDto)
  batchesStocks: BatchStockDto[]

  @ApiProperty({
    description: 'Data de dispensação',
    example: '2025-12-01',
  })
  @IsISO8601({ strict: true })
  @IsNotEmpty()
  dispensationDate: Date
}
