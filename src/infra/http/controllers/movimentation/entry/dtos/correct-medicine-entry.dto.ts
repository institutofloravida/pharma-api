import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CorrectionItemDto {
  @ApiProperty({
    description: 'ID da movimentação original a ser corrigida',
    example: 'uuid-da-movimentacao',
  })
  @IsUUID()
  movimentationId: string;

  @ApiProperty({
    description: 'Quantidade correta para este item',
    example: 30,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  newQuantity: number;
}

export class CorrectMedicineEntryDto {
  @ApiProperty({
    description: 'Lista de itens a corrigir',
    type: [CorrectionItemDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CorrectionItemDto)
  corrections: CorrectionItemDto[];

  @ApiProperty({
    description: 'Novo número de NF (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  nfNumber?: string;

  @ApiProperty({
    description: 'Nova data de entrada (opcional)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  entryDate?: Date;

  @ApiProperty({
    description: 'Novo tipo de movimentação (opcional)',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  movementTypeId?: string;
}
