import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { PharmaceuticalFormNotFoundError } from './_errors/pharmaceutical-form-not-found'
import { PharmaceuticalForm } from '@/domain/pharma/enterprise/entities/pharmaceutical-form'
import { PharmaceuticalFormsRepository } from '../../../repositories/pharmaceutical-forms-repository'

interface GetPharmaceuticalFormUseCaseRequest {
  id: string;
}

type GetPharmaceuticalFormUseCaseResponse = Either<
  PharmaceuticalFormNotFoundError,
  PharmaceuticalForm
>

@Injectable()
export class GetPharmaceuticalFormUseCase {
  constructor(
    private pharmaceuticalFormsRepository: PharmaceuticalFormsRepository,
  ) {}

  async execute({
    id,
  }: GetPharmaceuticalFormUseCaseRequest): Promise<GetPharmaceuticalFormUseCaseResponse> {
    const pharmaceuticalform =
      await this.pharmaceuticalFormsRepository.findById(id)

    if (!pharmaceuticalform) {
      return left(new PharmaceuticalFormNotFoundError(id))
    }

    return right(pharmaceuticalform)
  }
}
