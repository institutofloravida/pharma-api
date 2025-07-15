import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UseMedicine, type UseMedicineProps } from '@/domain/pharma/enterprise/use-medicine'
import { PrismaUseMedicineMapper } from '@/infra/database/prisma/mappers/prisma-use-medicine-maper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeUseMedicine(
  override: Partial<UseMedicineProps> = {},
  id?: UniqueEntityId,
) {
  const usemedicine = UseMedicine.create({
    year: faker.date.recent().getFullYear(),
    month: faker.date.recent().getMonth(),
    currentBalance: 0,
    previousBalance: 0,
    used: 0,
    medicineStockId: new UniqueEntityId(),
    createdAt: new Date(),
    ...override,
  },
  id)

  return usemedicine
}

@Injectable()
export class UseMedicineFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUseMedicine(data: Partial<UseMedicineProps> = {}): Promise<UseMedicine> {
    const UseMedicine = makeUseMedicine({
      ...data,
    })

    await this.prisma.useMedicine.create({
      data: PrismaUseMedicineMapper.toPrisma(UseMedicine),
    })

    return UseMedicine
  }
}
