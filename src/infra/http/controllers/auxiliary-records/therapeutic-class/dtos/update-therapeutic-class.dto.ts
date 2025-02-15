import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateTherapeuticClassDto {
  @ApiPropertyOptional({ example: 'New content for the therapeutic class' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ example: 'Description of the therapeutic class' })
  @IsOptional()
  @IsString()
  description?: string
}
