import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { PatientsRepository } from '../../repositories/patients-repository'

interface GetUsersMetricsUseCaseRequest {
  institutionId: string
}

type GetUsersMetricsUseCaseResponse = Either<
  null,
  {
    users: {
      total: number
      receiveMonth: number
    }
  }
>

@Injectable()
export class GetUsersMetricsUseCase {
  constructor(private patientsRepository: PatientsRepository) {}

  async execute({
    institutionId,
  }: GetUsersMetricsUseCaseRequest): Promise<GetUsersMetricsUseCaseResponse> {
    const usersMetrics = await this.patientsRepository.getPatientsMetrics(institutionId)
    return right({
      users: usersMetrics,
    })
  }
}
