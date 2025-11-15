import {
  IsUUID,
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class GetInventoryReportDto {
  @ApiProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'ID da instituição',
  })
  @IsUUID()
  institutionId: string;

  @ApiPropertyOptional({
    example: 'b2a8f1ee-5d77-4b01-80a5-e801745f0723',
    description: 'ID do estoque',
  })
  @IsOptional()
  @IsUUID()
  stockId?: string;

  @ApiPropertyOptional({
    example: 'Paracetamol',
    description: 'Nome do medicamento',
  })
  @IsOptional()
  @IsString()
  medicineName?: string;

  @ApiPropertyOptional({
    description: 'IDs das classes terapeuticas para filtrar os medicamentos',
    example: ['id1', 'id2', 'id3'],
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value) ? value : value ? [value] : undefined,
  )
  @IsString({ each: true })
  therapeuticClassesIds?: string[];

  @ApiPropertyOptional({
    example: true,
    description: 'Indica se o estoque está baixo',
  })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  isLowStock?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Quando true, retorna inventário agrupado',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() === 'true' : !!value,
  )
  @IsOptional()
  @IsBoolean()
  group?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Quando group=true, inclui detalhes dos lotes',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() === 'true' : !!value,
  )
  @IsOptional()
  @IsBoolean()
  includeBatches?: boolean;
}
