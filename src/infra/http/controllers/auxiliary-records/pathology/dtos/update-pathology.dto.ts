import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdatePathologyDto {
  @ApiProperty({
    example: 'E11',
    description: 'Código CID-10 atualizado da pathologia',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly code?: string

  @ApiProperty({
    example: 'Asma',
    description: 'Nome ou conteúdo atualizado da pathologia',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly name?: string
}
