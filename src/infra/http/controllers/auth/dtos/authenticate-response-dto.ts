import { ApiProperty } from '@nestjs/swagger'

export class AuthenticateResponseDto {
  @ApiProperty({
    description: 'The access token for the authenticated operator.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string
}
