import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Medicine } from '@/domain/pharma/enterprise/entities/medicine'
import { MedicinesRepository } from '../../../repositories/medicines-repository'
import { Meta } from '@/core/repositories/meta'

interface FetchMedicinesUseCaseRequest {
  page: number,
  content?: string,
  therapeuticClassesIds?: string[]
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
    therapeuticClassesIds,
  }: FetchMedicinesUseCaseRequest): Promise<FetchMedicinesUseCaseResponse> {
    const { medicines, meta } = await this.MedicinesRepository.findMany({ page }, { content, therapeuticClassesIds })

    return right({
      medicines,
      meta,
    })
  }
}
