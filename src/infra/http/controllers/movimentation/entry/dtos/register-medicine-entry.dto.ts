import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  IsISO8601,
  IsNotEmpty,
} from 'class-validator'
import { Type } from 'class-transformer'

class MedicineBatchDto {
  @ApiProperty({ description: 'Código do lote', example: 'ABCDE3' })
  @IsString()
  code: string

  @ApiProperty({
    description: 'Data de validade',
    example: '2025-12-01T03:00:00.000Z',
  })
  @IsISO8601({ strict: true })
  @IsNotEmpty()
  expirationDate: Date

  @ApiProperty({ description: 'ID do fabricante', example: 'manufacturer123' })
  @IsString()
  manufacturerId: string

  @ApiProperty({
    description: 'Data de fabricação',
    example: '2024-12-01T03:00:00.000Z',
    required: false,
  })
  @IsISO8601({ strict: true })
  @IsOptional()
  manufacturingDate?: Date

  @ApiProperty({
    description: 'Quantidade para entrada',
    example: 10,
  })
  @IsNumber()
  quantityToEntry: number
}

class MedicineEntryDto {
  @ApiProperty({
    description: 'ID da variante do medicamento',
    example: 'variant123',
  })
  @IsString()
  medicineVariantId: string

  @ApiProperty({
    description: 'Lista de lotes para este medicamento',
    type: [MedicineBatchDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicineBatchDto)
  batches: MedicineBatchDto[]
}

export class RegisterMedicineEntryDto {
  @ApiProperty({ description: 'ID do estoque', example: 'stock123' })
  @IsString()
  stockId: string

  @ApiProperty({ description: 'ID do tipo de movimento', example: 'moveType123' })
  @IsString()
  movementTypeId: string

  @ApiProperty({ description: 'Número da nota fiscal', example: 'NF123456' })
  @IsString()
  nfNumber: string

  @ApiProperty({
    description: 'Data da entrada',
    example: '2025-12-01T03:00:00.000Z',
    required: false,
  })
  @IsISO8601({ strict: true })
  @IsOptional()
  entryDate?: Date

  @ApiProperty({
    description: 'Lista de medicamentos com lotes para entrada',
    type: [MedicineEntryDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicineEntryDto)
  medicines: MedicineEntryDto[]
}
