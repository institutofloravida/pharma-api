import { Either, left, right } from '@/core/either'
import { Stock } from '@/domain/pharma/enterprise/entities/stock'
import { Injectable } from '@nestjs/common'
import { StocksRepository } from '../../../repositories/stocks-repository'
import { OperatorsRepository } from '../../../repositories/operators-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ForbiddenError } from '@/core/erros/errors/forbidden-error'

interface FetchStocksUseCaseRequest {
  page: number
  operatorId: string
  institutionsIds?: string[]
}

type FetchStocksUseCaseResponse = Either<
ForbiddenError,
  {
    stocks: Stock[]
  }
>

@Injectable()
export class FethStocksUseCase {
  constructor(
    private stocksRepository: StocksRepository,
    private operatorsRepository: OperatorsRepository,
  ) {}

  async execute({
    page,
    operatorId,
    institutionsIds,
  }: FetchStocksUseCaseRequest): Promise<FetchStocksUseCaseResponse> {
    const operator = await this.operatorsRepository.findById(operatorId)
    if (institutionsIds) {
      const institutionsIdsByOperator = operator?.institutionsIds
      for (const item of institutionsIds) {
        if (!institutionsIdsByOperator?.includes(new UniqueEntityId(item))) {
          return left(new ForbiddenError())
        }
      }
    }
    const stocks = await this.stocksRepository.findManyByInstitutionsId(
      {
        page,
      },
      institutionsIds ?? operator?.institutionsIds?.map(item => item.toString()))

    return right({
      stocks,
    })
  }
}
