import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateManufacturerDto {
  @ApiProperty({
    example: 'Aché',
    description: 'Nome ou conteúdo atualizado do fabricante ',
  })
  @IsNotEmpty()
  @IsString()
  readonly name?: string
}
