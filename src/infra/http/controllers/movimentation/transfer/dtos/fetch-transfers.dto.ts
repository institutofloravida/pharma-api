import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsISO8601,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { TransferStatus } from '@/domain/pharma/enterprise/entities/transfer';

export class FetchTransfersDto {
  @ApiProperty({
    description: 'ID da instituição',
    example: 'institution123',
  })
  @IsString()
  institutionId: string;

  @ApiPropertyOptional({
    description: 'ID do operador (opcional)',
    example: 'operator123',
    required: false,
  })
  @IsOptional()
  @IsString()
  operatorId?: string;

  @ApiPropertyOptional({
    description: 'Data da transferência',
    example: '2025-12-01T03:00:00.000Z',
  })
  @IsISO8601({ strict: true })
  @IsOptional()
  transferDate?: string;

  @ApiPropertyOptional({
    description: 'Status da transferência',
    example: TransferStatus.PENDING,
    enum: TransferStatus,
  })
  @IsOptional()
  @IsEnum(TransferStatus)
  status?: TransferStatus;

  @ApiProperty({
    description: 'Número da página para a consulta',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => Number(value) || 1)
  page: number = 1;
}
