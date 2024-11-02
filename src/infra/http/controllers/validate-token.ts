import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'

@Controller('/validate-token')
export class ValidateTokenController {
  constructor() {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle() {
    return { isValid: true }
  }
}
