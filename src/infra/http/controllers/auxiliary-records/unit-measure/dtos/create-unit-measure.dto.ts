import { IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUnitMeasureDTO {
  @ApiProperty({
    example: 'Kilogram',
    description: 'The name of the unit of measure.',
  })
  @IsString({ message: 'Name must be a string.' })
  name: string

  @ApiProperty({
    example: 'kg',
    description: 'The acronym for the unit of measure, between 1 and 10 characters.',
  })
  @IsString({ message: 'Acronym must be a string.' })
  @Length(1, 10, {
    message: 'Acronym must be between 1 and 10 characters.',
  })
  acronym: string
}
