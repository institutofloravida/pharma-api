import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsNumber, Min, IsEmail, IsUUID, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'

export class FetchOperatorsDto {
  @ApiPropertyOptional({
    description: 'Filtro de busca para os operadores',
    example: 'filano',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ example: 'joao.silva@email.com', description: 'E-mail do operador', required: false })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID da instituição', required: false })
  @IsOptional()
  @IsUUID()
  institutionId?: string

  @ApiPropertyOptional({
    example: OperatorRole.SUPER_ADMIN,
    description: 'O cargo do operador',
  })
  @IsOptional()
  @IsEnum(OperatorRole, { message: 'Deve ser um cargo válido' })
  role?: OperatorRole

  @ApiProperty({
    description: 'Número da página para a listagem',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1
}
