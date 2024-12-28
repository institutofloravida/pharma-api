import { IsEmail, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class AuthenticateOperatorDTO {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the operator used for authentication.',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string

  @ApiProperty({
    example: 'password123',
    description: 'The password of the operator. Must be at least 6 characters long.',
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string
}
