import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Medicine } from '@/domain/pharma/enterprise/entities/medicine'
import { MedicinesRepository } from '../../../repositories/medicines-repository'

interface FetchMedicinesUseCaseRequest {
  page: number
}

type FetchMedicinesUseCaseResponse = Either<
  null,
  {
    medicines: Medicine[]
  }
>

@Injectable()
export class FetchMedicinesUseCase {
  constructor(private MedicinesRepository: MedicinesRepository) {}

  async execute({
    page,
  }: FetchMedicinesUseCaseRequest): Promise<FetchMedicinesUseCaseResponse> {
    const medicines = await this.MedicinesRepository.findMany({ page })

    return right({
      medicines,
    })
  }
}
