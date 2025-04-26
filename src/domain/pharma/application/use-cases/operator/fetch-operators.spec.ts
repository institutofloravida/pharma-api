import { InMemoryOperatorsRepository } from 'test/repositories/in-memory-operators-repository'
import { FethOperatorsUseCase } from './fetch-operators'
import { makeOperator } from 'test/factories/make-operator'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'

let inMemoryInstitutionsRepository:InMemoryInstitutionsRepository
let inMemoryOperatorsRepository:InMemoryOperatorsRepository
let sut: FethOperatorsUseCase
describe('Fetch Operators', () => {
  beforeEach(() => {
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()

    inMemoryOperatorsRepository = new InMemoryOperatorsRepository(inMemoryInstitutionsRepository)

    sut = new FethOperatorsUseCase(inMemoryOperatorsRepository)
  })

  it('should be able to fetch operators', async () => {
    await inMemoryOperatorsRepository.create(
      makeOperator({ createdAt: new Date(2024, 0, 29) }),
    )
    await inMemoryOperatorsRepository.create(
      makeOperator({ createdAt: new Date(2024, 0, 20) }),
    )
    await inMemoryOperatorsRepository.create(
      makeOperator({ createdAt: new Date(2024, 0, 27) }),
    )

    const result = await sut.execute({
      page: 1,
      isSuper: false,
    })

    expect(result.value?.operators).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 29) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 27) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
    ])
  })

  it('should be able to fetch paginated operators', async () => {
    for (let i = 1; i <= 11; i++) {
      await inMemoryOperatorsRepository.create(makeOperator({
        email: `operatorcommon${i}@gmail.com`,
        name: `operator common ${i}`,
        role: OperatorRole.COMMON,
      }))
      await inMemoryOperatorsRepository.create(makeOperator({
        email: `operatormanager${i}@gmail.com`,
        name: `operator manager ${i}`,
        role: OperatorRole.MANAGER,
      }))
      await inMemoryOperatorsRepository.create(makeOperator({
        email: `operatorsuper${i}@gmail.com`,
        name: `operator super ${i}`,
        role: OperatorRole.SUPER_ADMIN,
      }))
    }

    const result = await sut.execute({
      page: 2,
      name: 'operator',
      isSuper: false,
    })
    const result2 = await sut.execute({
      page: 1,
      email: 'operatorcommon10@gmail.com',
      isSuper: true,
    })
    const result3 = await sut.execute({
      page: 1,
      role: OperatorRole.MANAGER,
      name: '1',
      isSuper: false,
    })
    if (result.isRight() && result2.isRight() && result3.isRight()) {
      expect(result.value?.operators).toHaveLength(10)
      expect(result2.value?.operators).toHaveLength(1)
      expect(result3.value?.operators).toHaveLength(3)
    }
  })
})
