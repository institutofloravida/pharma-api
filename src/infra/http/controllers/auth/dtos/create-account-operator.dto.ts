import { OperatorRole } from '@prisma/client'
import { IsArray, IsEmail, IsEnum, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateAccountOperatorDTO {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the operator.',
  })
  @IsString()
  name: string

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'The email address of the operator.',
  })
  @IsEmail()
  email: string

  @ApiProperty({
    example: 'securepassword123',
    description: 'The password for the operator account. Must be at least 6 characters long.',
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string

  @ApiPropertyOptional({
    example: OperatorRole.SUPER_ADMIN,
    description: 'The role assigned to the operator. It must be a valid OperatorRole.',
  })
  @IsOptional()
  @IsEnum(OperatorRole, { message: 'Role must be a valid OperatorRole' })
  role?: OperatorRole

  @ApiProperty({
    example: ['institutionId1', 'institutionId2'],
    description: 'List of institution IDs that the operator has access to.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  institutionsIds: string[]
}
