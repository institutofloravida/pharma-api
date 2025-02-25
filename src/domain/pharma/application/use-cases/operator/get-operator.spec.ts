import { InMemoryOperatorsRepository } from 'test/repositories/in-memory-operators-repository'
import { makeOperator } from 'test/factories/make-operator'
import { GetOperatorUseCase } from './get-operator'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { makeInstitution } from 'test/factories/make-insitution'

let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository
let inMemoryOperatorsRepository: InMemoryOperatorsRepository
let sut: GetOperatorUseCase
describe('Get Operator', () => {
  beforeEach(() => {
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository()
    inMemoryOperatorsRepository = new InMemoryOperatorsRepository(
      inMemoryInstitutionsRepository,
    )

    sut = new GetOperatorUseCase(inMemoryOperatorsRepository)
  })

  it('should be able to get operator', async () => {
    const institution = makeInstitution()
    await inMemoryInstitutionsRepository.create(institution)

    const operator = makeOperator({ institutionsIds: [institution.id] })
    await inMemoryOperatorsRepository.create(operator)

    const result = await sut.execute({ operatorId: operator.id.toString() })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value.operator.id).toBe(operator.id)
    }
  })
})
