import { Either, left, right } from '@/core/either'
import { Stock } from '@/domain/pharma/enterprise/entities/stock'
import { Injectable } from '@nestjs/common'
import { StocksRepository } from '../../../repositories/stocks-repository'
import { OperatorsRepository } from '../../../repositories/operators-repository'
import { ForbiddenError } from '@/core/erros/errors/forbidden-error'
import { InstitutionsRepository } from '../../../repositories/institutions-repository'
import { Meta } from '@/core/repositories/meta'

interface FetchStocksUseCaseRequest {
  page: number
  operatorId: string
  content?: string
  institutionsIds?: string[]
}

type FetchStocksUseCaseResponse = Either<
  ForbiddenError,
  {
    stocks: Array<{ stock: Stock } & { institutionName: string | null }>,
    meta: Meta
  }
>

@Injectable()
export class FetchStocksUseCase {
  constructor(
    private stocksRepository: StocksRepository,
    private operatorsRepository: OperatorsRepository,
    private institutionsRepository: InstitutionsRepository,
  ) {}

  async execute({
    page,
    operatorId,
    content,
    institutionsIds,
  }: FetchStocksUseCaseRequest): Promise<FetchStocksUseCaseResponse> {
    const operator = await this.operatorsRepository.findById(operatorId)
    if (institutionsIds) {
      const institutionsIdsByOperator = operator?.institutionsIds.map(item => item.toString())
      for (const item of institutionsIds) {
        if (!institutionsIdsByOperator?.includes(item)) {
          return left(new ForbiddenError())
        }
      }
    }
    if (!institutionsIds) {
      institutionsIds = operator?.institutionsIds?.map(item => item.toString())
    }

    const { stocks, meta } = await this.stocksRepository.findManyWithInstitution(
      {
        page,
      },
      institutionsIds ?? [],
      content,
      operator?.isSuperAdmin(),
    )

    return right({
      stocks,
      meta,
    })
  }
}
