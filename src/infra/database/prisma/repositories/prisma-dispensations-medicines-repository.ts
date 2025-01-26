import { DispensationsMedicinesRepository } from '@/domain/pharma/application/repositories/dispensations-medicines-repository'
import { Dispensation } from '@/domain/pharma/enterprise/entities/dispensation'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaDispensationMapper } from '../mappers/prisma-dispensation-mapper'

@Injectable()
export class PrismaDispensationsMedicinesRepository
implements DispensationsMedicinesRepository {
  constructor(private prisma: PrismaService) {}

  async create(dispensation: Dispensation): Promise<void> {
    const data = PrismaDispensationMapper.toPrisma(dispensation)
    await this.prisma.dispensation.create({
      data,
    })
  }
}
