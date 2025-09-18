import { left, right, type Either } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';
import { OperatorsRepository } from '../../repositories/operators-repository';
import { MedicinesEntriesRepository } from '../../repositories/medicines-entries-repository';
import { MedicinesExitsRepository } from '../../repositories/medicines-exits-repository';
import { DispensationsMedicinesRepository } from '../../repositories/dispensations-medicines-repository';
import { OperatorAlreadyHasCarriedOperationsError } from './_errors/operator-has-already-carried-out-operations-error';

interface deleteOperatorUseCaseRequest {
  operatorId: string;
}

type deleteOperatorUseCaseResponse = Either<
  OperatorAlreadyHasCarriedOperationsError | ResourceNotFoundError,
  null
>;

@Injectable()
export class DeleteOperatorUseCase {
  constructor(
    private operatorRepository: OperatorsRepository,
    private entriesRepository: MedicinesEntriesRepository,
    private exitsRepository: MedicinesExitsRepository,
    private dispensationRepository: DispensationsMedicinesRepository,
  ) {}

  async execute({
    operatorId,
  }: deleteOperatorUseCaseRequest): Promise<deleteOperatorUseCaseResponse> {
    const operator = await this.operatorRepository.findById(operatorId);
    if (!operator) {
      return left(new ResourceNotFoundError('Operador não encontrado'));
    }

    const hasEntries = await this.entriesRepository.findMany(
      { page: 1 },
      { operatorId },
    );

    const hasExits = await this.exitsRepository.findMany(
      { page: 1 },
      { operatorId },
    );

    const hasDispensations = await this.dispensationRepository.findMany(
      { page: 1 },
      { operatorId },
    );

    if (
      hasEntries.entries.length > 0 ||
      hasExits.medicinesExits.length > 0 ||
      hasDispensations.dispensations.length > 0
    ) {
      return left(new OperatorAlreadyHasCarriedOperationsError());
    }

    await this.operatorRepository.delete(operator);

    return right(null);
  }
}
