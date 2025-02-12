import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Meta } from '@/core/repositories/meta'
import { MovementTypesRepository } from '../../../repositories/movement-type'
import { MovementDirection, type MovementType } from '@/domain/pharma/enterprise/entities/movement-type'

interface FetchMovementTypesUseCaseRequest {
  page: number;
  direction?: MovementDirection;
  content?: string;
}

type FetchMovementTypesUseCaseResponse = Either<
  null,
  {
    movementTypes: MovementType[];
    meta: Meta;
  }
>

@Injectable()
export class FetchMovementTypesUseCase {
  constructor(private movementypesRepository: MovementTypesRepository) {}

  async execute({
    page,
    content,
    direction,
  }: FetchMovementTypesUseCaseRequest): Promise<FetchMovementTypesUseCaseResponse> {
    const { movementTypes, meta } = await this.movementypesRepository.findMany(
      { page },
      { direction, content },
    )

    return right({
      movementTypes,
      meta,
    })
  }
}
