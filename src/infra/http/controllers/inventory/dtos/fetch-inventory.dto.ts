import {
  IsUUID,
  IsString,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsArray,
  Min,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'

export class FetchInventoryDto {
  @ApiProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'ID da instituição',
  })
  @IsUUID()
  institutionId: string

  @ApiPropertyOptional({
    example: 'b2a8f1ee-5d77-4b01-80a5-e801745f0723',
    description: 'ID do estoque',
  })
  @IsOptional()
  @IsUUID()
  stockId?: string

  @ApiPropertyOptional({
    example: 'Paracetamol',
    description: 'Nome do medicamento',
  })
  @IsOptional()
  @IsString()
  medicineName?: string

  @ApiProperty({
    description: 'IDs das classes terapeuticas para filtrar os medicamentos',
    example: ['id1', 'id2', 'id3'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value)
    ? value
    : [value]))
  @IsString({ each: true })
  therapeuticClassesIds?: string[]

  @ApiPropertyOptional({
    example: true,
    description: 'Indica se o estoque está baixo',
  })
  @IsOptional()
  @IsBoolean()
  isLowStock?: boolean

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
