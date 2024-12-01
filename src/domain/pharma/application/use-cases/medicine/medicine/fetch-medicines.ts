import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Medicine } from '@/domain/pharma/enterprise/entities/medicine'
import { MedicinesRepository } from '../../../repositories/medicines-repository'
import type { Meta } from '@/core/repositories/meta'

interface FetchMedicinesUseCaseRequest {
  page: number,
  content?: string,
}

type FetchMedicinesUseCaseResponse = Either<
  null,
  {
    medicines: Medicine[],
    meta: Meta
  }
>

@Injectable()
export class FetchMedicinesUseCase {
  constructor(private MedicinesRepository: MedicinesRepository) {}

  async execute({
    page,
    content,
  }: FetchMedicinesUseCaseRequest): Promise<FetchMedicinesUseCaseResponse> {
    const { medicines, meta } = await this.MedicinesRepository.findMany({ page }, content)

    return right({
      medicines,
      meta,
    })
  }
}
