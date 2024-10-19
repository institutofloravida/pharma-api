import { ConflictException, UsePipes } from '@nestjs/common'
import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { z } from 'zod'

const createAccountOperatorBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreateAccountOperatorBodySchema = z.infer<typeof createAccountOperatorBodySchema>

@Controller('/accounts')
export class CreateAccountOperatorController {
  constructor(
    private prisma: PrismaService,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountOperatorBodySchema))
  async handle(@Body() body: CreateAccountOperatorBodySchema) {
    const { name, email, password } = body

    const operatorWithSameEmail = await this.prisma.operator.findUnique({
      where: {
        email,
      },
    })

    const passwordHash = await hash(password, 8)

    if (operatorWithSameEmail) {
      throw new ConflictException('Operator With same e-mail alrefy exists!')
    }
    await this.prisma.operator.create({
      data: {
        name,
        email,
        passwordHash,
      },
    })
  }
}
