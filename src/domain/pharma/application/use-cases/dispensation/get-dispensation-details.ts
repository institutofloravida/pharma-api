import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { DispensationsMedicinesRepository } from '../../repositories/dispensations-medicines-repository'
import { DispensationWithMedicines } from '@/domain/pharma/enterprise/entities/value-objects/dispensation-with-medicines'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'

interface GetDispensationDetailsUseCaseRequest {
  dispensationId: string
}

type GetDispensationDetailsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    dispensation: DispensationWithMedicines
  }
>

@Injectable()
export class GetDispensationDetailsUseCase {
  constructor(
    private dispensationsRepository: DispensationsMedicinesRepository,
  ) {}

  async execute({
    dispensationId,
  }: GetDispensationDetailsUseCaseRequest): Promise<GetDispensationDetailsUseCaseResponse> {
    const dispensation = await this.dispensationsRepository.findById(dispensationId)

    if (!dispensation) {
      return left(new ResourceNotFoundError())
    }

    return right({ dispensation })
  }
}
