import { IsDate, IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class FetchPatientsDto {
  @ApiProperty({
    example: 1,
    description: 'The page number for pagination. Must be an integer greater than or equal to 1.',
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number.' })
  @Min(1, { message: 'Page must be at least 1.' })
  page: number

  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'Optional query name for searching patients by name or other criteria.',
  })
  @IsOptional()
  @IsString({ message: 'name must be a string.' })
  name?: string

  @ApiPropertyOptional({
    example: '12345678901',
    description: 'The CPF of the patient for specific identification.',
  })
  @IsOptional()
  @IsString({ message: 'CPF must be a string.' })
  cpf?: string

  @ApiPropertyOptional({
    example: '123456789012345',
    description: 'The SUS number of the patient for specific identification.',
  })
  @IsOptional()
  @IsString({ message: 'SUS must be a string.' })
  sus?: string

  @ApiPropertyOptional({
    example: '2001-01-01',
    description: 'The birth date of the patient. Must be in ISO 8601 format (YYYY-MM-DD).',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Birth date must be a valid date.' })
  birthDate?: Date

  @ApiPropertyOptional({
    example: 'RG123456',
    description: 'The general registration (RG) of the patient.',
  })
  @IsOptional()
  @IsString({ message: 'General registration must be a string.' })
  generalRegistration?: string
}
