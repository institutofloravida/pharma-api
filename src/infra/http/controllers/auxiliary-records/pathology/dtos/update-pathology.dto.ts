import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdatePathologyDto {
  @ApiProperty({
    example: 'Asma',
    description: 'Nome ou conteúdo atualizado da pathologia',
  })
  @IsNotEmpty()
  @IsString()
  readonly name?: string
}
