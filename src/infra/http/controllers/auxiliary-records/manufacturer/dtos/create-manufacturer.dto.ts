import { IsOptional, IsString, Length } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateManufacturerDTO {
  @ApiProperty({
    example: 'Fabricante XYZ',
    description: 'The name of the manufacturer.',
  })
  @IsString()
  name: string

  @ApiProperty({
    example: '12345678000190',
    description: 'The CNPJ of the manufacturer, exactly 14 numeric characters.',
  })
  @IsString()
  @Length(14, 14, { message: 'CNPJ must be exactly 14 characters long.' })
  cnpj: string

  @ApiPropertyOptional({
    example: 'A manufacturer of high-quality medical supplies.',
    description: 'A brief description of the manufacturer.',
  })
  @IsOptional()
  @IsString()
  description?: string
}
