import { IsDate, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class GetDispenseInAPeriodDto {
  @ApiProperty({
    example: 'f7e2b46b-8b21-4e58-bf0f-9c9470fd0a66',
    description: 'ID da instituição onde a dispensação ocorreu.',
  })
  @IsString({ message: 'O ID da instituição deve ser uma string.' })
  institutionId: string

  @ApiProperty({
    example: '2024-01-01',
    description: 'Data inicial do período da consulta. Deve estar no formato ISO 8601 (YYYY-MM-DD).',
  })
  @Type(() => Date)
  @IsDate({ message: 'A data inicial deve ser uma data válida.' })
  startDate: Date

  @ApiProperty({
    example: '2024-01-31',
    description: 'Data final do período da consulta. Deve estar no formato ISO 8601 (YYYY-MM-DD).',
  })
  @Type(() => Date)
  @IsDate({ message: 'A data final deve ser uma data válida.' })
  endDate: Date

  @ApiPropertyOptional({
    example: 'f30579b4-d4d9-46f8-9e59-645d45df1ab3',
    description: 'ID do paciente para filtrar as dispensações.',
  })
  @IsOptional()
  @IsString({ message: 'O ID do paciente deve ser uma string.' })
  patientId?: string

  @ApiPropertyOptional({
    example: '4a8cfc56-6d7d-4e89-a548-abb4f0a5a0cb',
    description: 'ID do operador responsável pela dispensação.',
  })
  @IsOptional()
  @IsString({ message: 'O ID do operador deve ser uma string.' })
  operatorId?: string
}
