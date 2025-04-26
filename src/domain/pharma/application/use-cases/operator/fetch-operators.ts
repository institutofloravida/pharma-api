import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { OperatorsRepository } from '../../repositories/operators-repository'
import { Meta } from '@/core/repositories/meta'
import { OperatorWithInstitution } from '@/domain/pharma/enterprise/entities/value-objects/operator-with-institution'
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator'

interface FetchOperatorsUseCaseRequest {
  page: number;
  name?: string;
  email?: string;
  institutionId?: string;
  role?: OperatorRole;
  isSuper: boolean;
}

type FetchOperatorsUseCaseResponse = Either<
  null,
  {
    operators: OperatorWithInstitution[];
    meta: Meta;
  }
>

@Injectable()
export class FethOperatorsUseCase {
  constructor(private operatorsRepository: OperatorsRepository) {}

  async execute({
    page,
    name,
    email,
    institutionId,
    role,
    isSuper,
  }: FetchOperatorsUseCaseRequest): Promise<FetchOperatorsUseCaseResponse> {
    const { operators, meta } = await this.operatorsRepository.findMany(
      { page },
      { email, institutionId, name, role },
      isSuper,
    )

    return right({
      operators,
      meta,
    })
  }
}
