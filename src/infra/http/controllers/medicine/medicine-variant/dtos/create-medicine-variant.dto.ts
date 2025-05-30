import { IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateMedicineVariantDto {
  @ApiProperty({
    example: '500mg',
    description: 'The dosage of the medicine variant.',
  })
  @IsString({ message: 'Dosage must be a string.' })
  dosage: string

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the medicine associated with this variant.',
  })
  @IsString({ message: 'Medicine ID must be a string.' })
  medicineId: string

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description: 'The ID of the pharmaceutical form of the medicine.',
  })
  @IsString({ message: 'Pharmaceutical Form ID must be a string.' })
  pharmaceuticalFormId: string

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174002',
    description: 'The ID of the unit measure for the medicine.',
  })
  @IsString({ message: 'Unit Measure ID must be a string.' })
  unitMeasureId: string

  @ApiPropertyOptional({
    example: 'CX 10',
    description: 'informações complementares',
    required: false,
  })
  @IsString()
  @IsOptional()
  complement?: string | null
}
