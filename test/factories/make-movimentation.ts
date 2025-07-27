import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Movimentation, type MovimentationProps } from '@/domain/pharma/enterprise/entities/movimentation'
import { faker } from '@faker-js/faker'

export function makeMovimentation(
  override: Partial<MovimentationProps> = {},
  id?: UniqueEntityId,
) {
  const movimentation = Movimentation.create({
    batchStockId: new UniqueEntityId(),
    direction: 'ENTRY',
    quantity: faker.number.int({ min: 1, max: 100 }),
    dispensationId: undefined,
    entryId: new UniqueEntityId(),
    movementTypeId: new UniqueEntityId(),
    exitId: undefined,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...override,
  },
  id)

  return movimentation
}

// @Injectable()
// export class MovimentationFactory {
//   constructor(private prisma: PrismaService) {}

//   async makePrismaMovimentation(data: Partial<MovimentationProps> = {}): Promise<Movimentation> {
//     const movimentation = makeMovimentation(
//       data,
//     )

//     await this.prisma.movimentation.create({
//       data: PrismaMovimentationMapper.toPrisma(movimentation),
//     })

//     return movimentation
//   }
// }
