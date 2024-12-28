import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreatePathologyDTO {
  @ApiProperty({
    example: 'Diabetes Mellitus',
    description: 'The name of the pathology.',
  })
  @IsString({ message: 'Name must be a string.' })
  name: string
}
