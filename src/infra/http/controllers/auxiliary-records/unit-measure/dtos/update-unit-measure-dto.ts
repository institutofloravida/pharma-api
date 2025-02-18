import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateUnitMeasureDto {
  @ApiProperty({
    example: 'miligrama',
    description: 'Nome ou conteúdo atualizado da unidade de medida',
  })
  @IsNotEmpty()
  @IsString()
  readonly name?: string

  @ApiProperty({
    example: 'ml',
    description: 'Nome ou conteúdo atualizado da abreviação da unidade de medida',
  })
  @IsNotEmpty()
  @IsString()
  readonly acronym?: string
}
