import { Body, Controller, HttpCode, Post, UseGuards, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'

const createTherapeuticClassBodySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
})

type CreateTherapeuticClassBodySchema = z.infer<typeof createTherapeuticClassBodySchema>

@Controller('/therapeutic-class')
@UseGuards(JwtAuthGuard)
export class CreateTherapeuticClassController {
  constructor(
    private prisma: PrismaService,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createTherapeuticClassBodySchema))
  async handle(@Body() body: CreateTherapeuticClassBodySchema) {
    const { name, description } = body

    const therapeuticClass = await this.prisma.therapeuticClass.create({
      data: {
        name,
        description,
      },
    })

    return { therapeutic_class: therapeuticClass }
  }
}
