import { Controller, Get, Request, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('auth')
@Controller('/validate-token')
@UseGuards(JwtAuthGuard)
export class ValidateTokenController {
  constructor() {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Request() req) {
    return { isValid: true, user: req.user }
  }
}
