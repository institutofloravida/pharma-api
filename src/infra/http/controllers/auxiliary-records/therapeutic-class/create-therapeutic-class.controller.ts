import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CreateTherapeuticClassDto } from './dtos/create-therapeutic-class.dto'

@ApiTags('therapeutic-class')
@ApiBearerAuth()
@Controller('/therapeutic-class')
@UseGuards(JwtAuthGuard)
export class CreateTherapeuticClassController {
  constructor(
    private prisma: PrismaService,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreateTherapeuticClassDto) {
    const { name } = body

    const therapeuticClass = await this.prisma.therapeuticClass.create({
      data: {
        name,
      },
    })

    return { therapeutic_class: therapeuticClass }
  }
}
