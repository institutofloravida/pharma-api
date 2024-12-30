import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateTherapeuticClassDto {
  @ApiProperty({
    example: 'Antibiotics',
    description: 'The name of the therapeutic class.',
  })
  @IsString({ message: 'Name must be a string.' })
  name: string
}
