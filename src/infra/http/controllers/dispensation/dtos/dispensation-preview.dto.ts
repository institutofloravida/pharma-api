import { Min, IsString, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class DispensationPreviewDto {
  @ApiProperty({
    description: 'Quantidade desejada para a dispensa',
    example: 30,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantityRequired: number

  @ApiProperty({
    description: 'ID do medicamento no estoque',
    example: '14176e2d-ae23-44a0-bc49-dc9e2b0a92e4',
    required: true,
  })
  @IsString()
  medicineStockId: string
}
