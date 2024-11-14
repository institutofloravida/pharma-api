import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { PharmaceuticalFormsRepository } from '../../../repositories/pharmaceutical-forms-repository'
import { PharmaceuticalForm } from '@/domain/pharma/enterprise/entities/pharmaceutical-form'

interface FetchPharmaceuticalFormsUseCaseRequest {
  page: number
}

type FetchPharmaceuticalFormsUseCaseResponse = Either<
  null,
  {
    pharmaceuticalForms: PharmaceuticalForm[]
  }
>

@Injectable()
export class FetchPharmaceuticalFormsUseCase {
  constructor(private pharmaceuticalFormsRepository: PharmaceuticalFormsRepository) {}

  async execute({
    page,
  }: FetchPharmaceuticalFormsUseCaseRequest): Promise<FetchPharmaceuticalFormsUseCaseResponse> {
    const pharmaceuticalForms = await this.pharmaceuticalFormsRepository.findMany({ page })

    return right({
      pharmaceuticalForms,
    })
  }
}
