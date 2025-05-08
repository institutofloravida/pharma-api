import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ExitType, MedicineExit, type MedicineExitProps } from '@/domain/pharma/enterprise/entities/exit'
import { PrismaMedicineExitMapper } from '@/infra/database/prisma/mappers/prisma-medicine-exit-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeMedicineExit(
  override: Partial<MedicineExitProps> = {},
  id?: UniqueEntityId,
) {
  const medicineexit = MedicineExit.create({
    batchestockId: new UniqueEntityId(),
    dispensationId: undefined,
    exitType: ExitType.MOVEMENT_TYPE,
    medicineStockId: new UniqueEntityId(),
    exitDate: new Date(),
    movementTypeId: new UniqueEntityId(),
    operatorId: new UniqueEntityId(),
    quantity: faker.number.int({ max: 100, min: 1 }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...override,
  },
  id)

  return medicineexit
}

@Injectable()
export class MedicineExitFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaMedicineExit(data: Partial<MedicineExitProps> = {}): Promise<MedicineExit> {
    const medicineexit = makeMedicineExit(
      data,
    )

    await this.prisma.exit.create({
      data: PrismaMedicineExitMapper.toPrisma(medicineexit),
    })

    return medicineexit
  }
}
