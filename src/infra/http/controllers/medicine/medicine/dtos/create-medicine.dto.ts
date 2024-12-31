import { IsArray, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateMedicineDTO {
  @ApiProperty({
    example: 'Paracetamol',
    description: 'The name of the medicine.',
  })
  @IsString({ message: 'Name must be a string.' })
  name: string

  @ApiPropertyOptional({
    example: 'Used for pain relief and fever reduction.',
    description: 'A brief description of the medicine.',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  description?: string

  @ApiProperty({
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001',
    ],
    description:
      'Array of IDs for therapeutic classes associated with the medicine.',
    isArray: true,
  })
  @IsArray({ message: 'Therapeutic classes must be an array of IDs.' })
  @IsString({
    each: true,
    message: 'Each therapeutic class ID must be a string.',
  })
  therapeuticClassesIds: string[]
}
