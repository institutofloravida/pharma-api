import { InMemoryOperatorsRepository } from 'test/repositories/in-memory-operators-repository';
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository';
import { makeOperator } from 'test/factories/make-operator';
import { makeInstitution } from 'test/factories/make-insitution';
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator';
import { DeactivateOperatorUseCase } from './deactivate-operator';

let inMemoryInstitutionsRepository: InMemoryInstitutionsRepository;
let inMemoryOperatorsRepository: InMemoryOperatorsRepository;
let sut: DeactivateOperatorUseCase;

describe('Deactivate Operator', () => {
  beforeEach(() => {
    inMemoryInstitutionsRepository = new InMemoryInstitutionsRepository();
    inMemoryOperatorsRepository = new InMemoryOperatorsRepository(
      inMemoryInstitutionsRepository,
    );
    sut = new DeactivateOperatorUseCase(inMemoryOperatorsRepository);
  });
  it('should be able deactivate a operator', async () => {
    const institution = makeInstitution();
    await inMemoryInstitutionsRepository.create(institution);

    const operator = makeOperator({
      name: 'Operator 1',
      email: 'operator@gmail.com',
      role: OperatorRole.COMMON,
      active: true,
      institutionsIds: [institution.id],
    });
    await inMemoryOperatorsRepository.create(operator);

    const result = await sut.execute({
      operatorId: operator.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(inMemoryOperatorsRepository.items).toHaveLength(1);
      expect(inMemoryOperatorsRepository.items[0].active).toBe(false);
    }
  });
});
