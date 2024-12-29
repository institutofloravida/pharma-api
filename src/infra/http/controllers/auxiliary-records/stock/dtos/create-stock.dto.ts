import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateStockDTO {
  @ApiProperty({
    example: 'Main Warehouse',
    description: 'The name of the stock.',
  })
  @IsString({ message: 'Name must be a string.' })
  name: string

  @ApiPropertyOptional({
    example: true,
    description: 'The status of the stock. If omitted, it defaults to active.',
  })
  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean value.' })
  status?: boolean

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the institution to which the stock belongs.',
  })
  @IsString({ message: 'Institution ID must be a string.' })
  institutionId: string
}
