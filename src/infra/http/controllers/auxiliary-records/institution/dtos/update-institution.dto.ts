import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export class UpdateInstitutionDto {
  @ApiProperty({
    example: 'Hospital Central Atualizado',
    description: 'Nome ou conteúdo atualizado da instituição',
  })
  @IsNotEmpty()
  @IsString()
  readonly name?: string

  @ApiProperty({
    example: '12345678000195',
    description: 'CNPJ da instituição (14 caracteres)',
  })
  @IsNotEmpty()
  @IsString()
  @Length(14, 14, { message: 'CNPJ deve ter 14 caracteres' })
  readonly cnpj?: string

  @ApiPropertyOptional({
    example: 'Hospital referência na cidade.',
    description: 'Descrição opcional da instituição',
  })
  @IsOptional()
  @IsString()
  readonly description?: string | null
}
