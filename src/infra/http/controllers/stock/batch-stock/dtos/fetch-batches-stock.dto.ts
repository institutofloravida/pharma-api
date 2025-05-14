import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class FetchBatchesStockDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'The page number for pagination. Must be an integer greater than or equal to 1.',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer.' })
  @Min(1, { message: 'Page must be at least 1.' })
  page: number = 1

  @ApiProperty({ example: 'medicine-stock-456', description: 'Medicine stock ID' })
  @IsString({ message: 'The "medicineStockId" field must be a string.' })
  medicineStockId: string

  @ApiPropertyOptional({ example: 'Batch-789', description: 'Optional batch code' })
  @IsOptional()
  @IsString({ message: 'The "code" field must be a string.' })
  code?: string
}
