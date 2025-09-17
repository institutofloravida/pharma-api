import { left, right, type Either } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';
import { OperatorsRepository } from '../../repositories/operators-repository';

interface deactivateOperatorUseCaseRequest {
  operatorId: string;
}

type deactivateOperatorUseCaseResponse = Either<ResourceNotFoundError, null>;

@Injectable()
export class DeactivateOperatorUseCase {
  constructor(private operatorRepository: OperatorsRepository) {}

  async execute({
    operatorId,
  }: deactivateOperatorUseCaseRequest): Promise<deactivateOperatorUseCaseResponse> {
    const operator = await this.operatorRepository.findById(operatorId);
    if (!operator) {
      return left(new ResourceNotFoundError('Operador não encontrado'));
    }

    operator.deactivate();
    await this.operatorRepository.save(operator);

    return right(null);
  }
}
