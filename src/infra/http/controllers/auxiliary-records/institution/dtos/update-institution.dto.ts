import { InstitutionType } from '@/domain/pharma/enterprise/entities/institution'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export class UpdateInstitutionDto {
  @ApiProperty({
    example: 'Hospital Central Atualizado',
    description: 'Nome ou conteúdo atualizado da instituição',
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    example: '12345678000195',
    description: 'CNPJ da instituição (14 caracteres)',
  })
  @IsNotEmpty()
  @IsString()
  @Length(14, 14, { message: 'CNPJ deve ter 14 caracteres' })
  cnpj: string

  @ApiProperty({
    example: 'A leading institution in healthcare and research.',
    description: 'A brief description of the institution.',
  })
  @IsString()
  responsible: string

  @ApiProperty({
    example: true,
    description: 'Indicates whether the institution controls stock.',
  })
  @IsBoolean()
  controlStock: boolean

  @ApiProperty({
    example: 'ONG',
    description: 'Tipo de Instituição',
    enum: InstitutionType,
  })
  @IsEnum(InstitutionType)
  type: InstitutionType

  @ApiPropertyOptional({
    example: 'Hospital referência na cidade.',
    description: 'Descrição opcional da instituição',
  })
  @IsOptional()
  @IsString()
  description?: string | null
}
