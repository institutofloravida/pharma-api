import { IsNumber, IsOptional, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class FetchPathologiesDto {
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
