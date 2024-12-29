import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreatePharmaceuticalFormDto {
  @ApiProperty({
    example: 'Tablet',
    description: 'The name of the pharmaceutical form.',
  })
  @IsString({ message: 'Name must be a string.' })
  name: string
}
