import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { TherapeuticClass } from '@/domain/pharma/enterprise/entities/therapeutic-class'
import { TherapeuticClassNotFoundError } from './_errors/therapeutic-class-not-found-error'
import { TherapeuticClassesRepository } from '../../../repositories/therapeutic-classes-repository'

interface GetTherapeuticClassUseCaseRequest {
  id: string;
}

type GetTherapeuticClassUseCaseResponse = Either<
  TherapeuticClassNotFoundError,
  TherapeuticClass
>

@Injectable()
export class GetTherapeuticClassUseCase {
  constructor(
    private therapeuticClassesRepository: TherapeuticClassesRepository,
  ) {}

  async execute({
    id,
  }: GetTherapeuticClassUseCaseRequest): Promise<GetTherapeuticClassUseCaseResponse> {
    const therapeuticclass =
      await this.therapeuticClassesRepository.findById(id)
    if (!therapeuticclass) {
      return left(new TherapeuticClassNotFoundError(id))
    }
    return right(therapeuticclass)
  }
}
