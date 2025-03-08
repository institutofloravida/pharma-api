import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsBoolean } from 'class-validator'

export class UpdateStockDto {
  @ApiProperty({ example: 'Novo nome do estoque', description: 'Nome atualizado do estoque', required: false })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({ example: true, description: 'Status do estoque', required: false })
  @IsOptional()
  @IsBoolean()
  status?: boolean
}
