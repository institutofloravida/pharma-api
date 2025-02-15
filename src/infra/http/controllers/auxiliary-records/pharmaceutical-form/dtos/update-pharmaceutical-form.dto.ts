import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdatePharmaceuticalFormDto {
  @ApiProperty({
    example: 'Comprimido',
    description: 'Nome ou conteúdo atualizado da forma farmacêutica',
  })
  @IsNotEmpty()
  @IsString()
  readonly name?: string
}
