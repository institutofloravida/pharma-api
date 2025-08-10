import { left, right, type Either } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';
import { TherapeuticClassHasDependencyError } from './_errors/therapeutic-class-has-dependency';
import { MedicinesRepository } from '../../../repositories/medicines-repository';
import { TherapeuticClassesRepository } from '../../../repositories/therapeutic-classes-repository';

interface deleteTherapeuticClassUseCaseRequest {
  therapeuticClassId: string;
}

type deleteTherapeuticClassUseCaseResponse = Either<
  ResourceNotFoundError | TherapeuticClassHasDependencyError,
  null
>;

@Injectable()
export class DeleteTherapeuticClassUseCase {
  constructor(
    private therapeuticClassRepository: TherapeuticClassesRepository,
    private medicinesRepository: MedicinesRepository,
  ) {}

  async execute({
    therapeuticClassId,
  }: deleteTherapeuticClassUseCaseRequest): Promise<deleteTherapeuticClassUseCaseResponse> {
    const therapeuticclass =
      await this.therapeuticClassRepository.findById(therapeuticClassId);
    if (!therapeuticclass) {
      return left(new ResourceNotFoundError());
    }

    const { meta } = await this.medicinesRepository.findMany(
      { page: 1 },
      { therapeuticClassesIds: [therapeuticclass.id.toString()] },
    );

    const therapeuticclassHasDependency = meta.totalCount;

    if (therapeuticclassHasDependency > 0) {
      return left(new TherapeuticClassHasDependencyError());
    }

    await this.therapeuticClassRepository.delete(therapeuticClassId);

    return right(null);
  }
}
