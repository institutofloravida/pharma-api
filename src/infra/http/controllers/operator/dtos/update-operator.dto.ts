import {
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  IsArray,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'

export class UpdateOperatorDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome do operador',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({
    example: 'joao.silva@email.com',
    description: 'E-mail do operador',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiProperty({
    example: 'ADMIN',
    description: 'Função do operador',
    required: false,
    enum: [OperatorRole.COMMON, OperatorRole.MANAGER, OperatorRole.SUPER_ADMIN],
  })
  @IsOptional()
  role?: OperatorRole

  @ApiProperty({
    example: 'senhaSegura123',
    description: 'Senha do operador',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string

  @ApiProperty({
    example: ['c1a9b5f6-8d7a-4e3d-90f2-1b2d3e4f5a6b'],
    description: 'Lista de IDs das instituições associadas',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  institutionsIds?: string[]
}
