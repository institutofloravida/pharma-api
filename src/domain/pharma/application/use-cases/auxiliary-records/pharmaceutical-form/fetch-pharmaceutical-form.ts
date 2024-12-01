import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { PharmaceuticalFormsRepository } from '../../../repositories/pharmaceutical-forms-repository'
import { PharmaceuticalForm } from '@/domain/pharma/enterprise/entities/pharmaceutical-form'
import type { Meta } from '@/core/repositories/meta'

interface FetchPharmaceuticalFormsUseCaseRequest {
  page: number
  content?: string
}

type FetchPharmaceuticalFormsUseCaseResponse = Either<
  null,
  {
    pharmaceuticalForms: PharmaceuticalForm[]
    meta: Meta
  }
>

@Injectable()
export class FetchPharmaceuticalFormsUseCase {
  constructor(private pharmaceuticalFormsRepository: PharmaceuticalFormsRepository) {}

  async execute({
    page,
    content,
  }: FetchPharmaceuticalFormsUseCaseRequest): Promise<FetchPharmaceuticalFormsUseCaseResponse> {
    const { pharmaceuticalForms, meta } = await this.pharmaceuticalFormsRepository.findMany({ page }, content)

    return right({
      pharmaceuticalForms,
      meta,
    })
  }
}
