import { left, right, type Either } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';
import { OperatorsRepository } from '../../repositories/operators-repository';

interface activateOperatorUseCaseRequest {
  operatorId: string;
}

type activateOperatorUseCaseResponse = Either<ResourceNotFoundError, null>;

@Injectable()
export class ActivateOperatorUseCase {
  constructor(private operatorRepository: OperatorsRepository) {}

  async execute({
    operatorId,
  }: activateOperatorUseCaseRequest): Promise<activateOperatorUseCaseResponse> {
    const operator = await this.operatorRepository.findById(operatorId);
    if (!operator) {
      return left(new ResourceNotFoundError('Operador não encontrado'));
    }

    operator.activate();
    await this.operatorRepository.save(operator);

    return right(null);
  }
}
