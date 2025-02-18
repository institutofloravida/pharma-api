import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export class UpdateManufacturerDto {
  @ApiProperty({
    example: 'Aché laboratórios',
    description: 'Nome ou conteúdo atualizado do fabricante',
  })
  @IsNotEmpty()
  @IsString()
  readonly name?: string

  @ApiProperty({
    example: '12345678000195',
    description: 'CNPJ do fabricante (14 caracteres)',
  })
  @IsNotEmpty()
  @IsString()
  @Length(14, 14, { message: 'CNPJ deve ter 14 caracteres' })
  readonly cnpj?: string

  @ApiPropertyOptional({
    example: 'Fabricante referência na cidade.',
    description: 'Descrição opcional do fabricante',
  })
  @IsOptional()
  @IsString()
  readonly description?: string | null
}
