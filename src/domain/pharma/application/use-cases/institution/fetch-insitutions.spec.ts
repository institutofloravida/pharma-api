import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { FethInstitutionsUseCase } from './fetch-institutions'
import { makeInstitution } from 'test/factories/make-insitution'
import { InMemoryOperatorsRepository } from 'test/repositories/in-memory-operators-repository'
import { makeOperator } from 'test/factories/make-operator'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryOperatorsRepository: InMemoryOperatorsRepository
let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository
let sut: FethInstitutionsUseCase
describe('Fetch Institutions', () => {
  beforeEach(() => {
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()
    inMemoryOperatorsRepository = new InMemoryOperatorsRepository(
      inMemoryInstitutionsRepository,
    )

    sut = new FethInstitutionsUseCase(
      inMemoryInstitutionsRepository,
      inMemoryOperatorsRepository,
    )
  })

  it('should be able to fetch institutions', async () => {
    const institution1 = makeInstitution({ createdAt: new Date(2024, 0, 29) })
    const institution2 = makeInstitution({ createdAt: new Date(2024, 0, 20) })
    const institution3 = makeInstitution({ createdAt: new Date(2024, 0, 27) })

    await Promise.all([
      inMemoryInstitutionsRepository.create(
        institution1),
      inMemoryInstitutionsRepository.create(
        institution2),
      inMemoryInstitutionsRepository.create(
        institution3),
    ])

    const operator = makeOperator({
      institutionsIds: [
        institution1.id,
        institution2.id,
        institution3.id,
      ],
    })
    await inMemoryOperatorsRepository.create(operator)

    const result = await sut.execute({
      page: 1,
      operatorId: operator.id.toString(),
    })
    if (result.isRight()) {
      expect(result.value.institutions).toEqual([
        expect.objectContaining({ createdAt: new Date(2024, 0, 29) }),
        expect.objectContaining({ createdAt: new Date(2024, 0, 27) }),
        expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
      ])
    }
  })

  it('should be able to fetch paginated institutions', async () => {
    const institutionsIds: UniqueEntityId[] = []
    for (let i = 1; i <= 22; i++) {
      const insitution = makeInstitution({
        cnpj: `111111111111${String(i).padStart(2, '0')}`,
      })

      await inMemoryInstitutionsRepository.create(
        insitution,
      )
      institutionsIds.push(insitution.id)
    }

    const operator = makeOperator({
      institutionsIds,
    })
    await inMemoryOperatorsRepository.create(operator)

    const result = await sut.execute({
      page: 1,
      cnpj: '11111111111121',
      operatorId: operator.id.toString(),
    })
    if (result.isRight()) {
      expect(result.value?.institutions).toHaveLength(1)
    }
  })
})
