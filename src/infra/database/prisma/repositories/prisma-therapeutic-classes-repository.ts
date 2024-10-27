import { TherapeuticClassesRepository } from '@/domain/pharma/application/repositories/therapeutic-classes-repository'
import { TherapeuticClass } from '@/domain/pharma/enterprise/entities/therapeutic-class'
import { PrismaService } from '../prisma.service'
import { PrismaTherapeuticClassMapper } from '../mappers/prisma-therapeutic-class.mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaTherapeuticClassesRepository implements TherapeuticClassesRepository {
  constructor(private prisma: PrismaService) {}

  async create(therapeuticClass: TherapeuticClass) {
    await this.prisma.therapeuticClass.create({
      data: PrismaTherapeuticClassMapper.toPrisma(therapeuticClass),
    })
  }

  async findByContent(content: string): Promise<TherapeuticClass | null> {
    throw new Error('Method not implemented.')
  }
}
