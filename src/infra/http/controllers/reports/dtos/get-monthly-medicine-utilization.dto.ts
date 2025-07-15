import { IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class GetMonthlyMedicineUtilizationDto {
  @ApiProperty({
    example: 'f7e2b46b-8b21-4e58-bf0f-9c9470fd0a66',
    description: 'ID da instituição onde a dispensação ocorreu.',
  })
  @IsString({ message: 'O ID da instituição deve ser uma string.' })
  institutionId: string

  @ApiPropertyOptional({
    example: 'f30579b4-d4d9-46f8-9e59-645d45df1ab3',
    description: 'ID do estoque para filtrar as movimentações.',
  })
  @IsOptional()
  @IsString({ message: 'O ID do estoque deve ser uma string.' })
  stockId?: string

  @ApiProperty({
    example: 2025,
    description: 'ano da utilização.',
  })
  @Type(() => Number)
  @IsNumber()
  year: number

  @ApiProperty({
    example: 3,
    description: 'mês da utilização. deve ser um número de 0 a 11',
  })
  @Type(() => Number)
  @IsNumber()
  month: number
}
