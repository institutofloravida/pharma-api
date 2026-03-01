import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreatePathologyDTO {
  @ApiProperty({
    example: 'E11',
    description: 'The CID-10 code of the pathology.',
  })
  @IsString({ message: 'Code must be a string.' })
  code: string

  @ApiProperty({
    example: 'Diabetes Mellitus',
    description: 'The name of the pathology.',
  })
  @IsString({ message: 'Name must be a string.' })
  name: string
}
