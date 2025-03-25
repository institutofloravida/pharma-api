import { IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateMedicineVariantDto {
  @ApiProperty({
    example: '500mg',
    description: 'The dosage of the medicine variant.',
  })
  @IsString({ message: 'Dosage must be a string.' })
  @IsOptional()
  dosage?: string

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description: 'The ID of the pharmaceutical form of the medicine.',
  })
  @IsString({ message: 'Pharmaceutical Form ID must be a string.' })
  @IsOptional()
  pharmaceuticalFormId?: string

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174002',
    description: 'The ID of the unit measure for the medicine.',
  })
  @IsString({ message: 'Unit Measure ID must be a string.' })
  @IsOptional()
  unitMeasureId?: string
}
