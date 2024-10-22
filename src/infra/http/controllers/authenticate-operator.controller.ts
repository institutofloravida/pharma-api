import { Body, Controller, HttpCode, Post, UnauthorizedException, UsePipes } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { compare } from 'bcryptjs'

const authenticateOperatorBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateOperatorBodySchema = z.infer<typeof authenticateOperatorBodySchema>

@Controller('/sessions')
export class AuthenticateOperatorController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateOperatorBodySchema))
  async handle(@Body() body: AuthenticateOperatorBodySchema) {
    const { email, password } = body

    const operator = await this.prisma.operator.findUnique({
      where: {
        email,
      },
    })

    if (!operator) {
      throw new UnauthorizedException('credentials invalid.')
    }

    const passwordIsValid = await compare(password, operator.passwordHash)
    if (!passwordIsValid) {
      throw new UnauthorizedException('credentials invalid.')
    }

    const accessToken = this.jwt.sign({ sub: operator.id })

    return { access_token: accessToken }
  }
}
