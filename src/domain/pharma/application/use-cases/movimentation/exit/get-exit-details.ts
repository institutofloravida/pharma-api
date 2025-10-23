import { Either, left, right } from '@/core/either';
import { MedicinesExitsRepository } from '@/domain/pharma/application/repositories/medicines-exits-repository';
import { ExitDetails } from '@/domain/pharma/enterprise/entities/value-objects/exit-details';
import { Injectable } from '@nestjs/common';

interface GetExitDetailsUseCaseRequest {
  exitId: string;
}

type GetExitDetailsUseCaseResponse = Either<
  null,
  {
    exit: ExitDetails;
  }
>;

@Injectable()
export class GetExitDetailsUseCase {
  constructor(private exitsRepository: MedicinesExitsRepository) {}

  async execute({
    exitId,
  }: GetExitDetailsUseCaseRequest): Promise<GetExitDetailsUseCaseResponse> {
    const exit = await this.exitsRepository.findByIdWithDetails(exitId);

    if (!exit) {
      return left(null);
    }

    return right({
      exit,
    });
  }
}
