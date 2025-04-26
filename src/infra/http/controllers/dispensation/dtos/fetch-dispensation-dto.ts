import { IsOptional, Min, IsString, IsNumber, IsISO8601 } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class FetchDispensationsDto {
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

  @ApiPropertyOptional({
    description: 'ID do paciente (opcional).',
    example: '12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  patientId?: string

  @ApiProperty({
    description: 'Data da dispensa',
    example: '2025-12-01T03:00:00.000Z',
  })
  @IsISO8601({ strict: true })
  @IsOptional()
  dispensationDate: Date
}
