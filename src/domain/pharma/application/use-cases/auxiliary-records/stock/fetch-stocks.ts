import { Either, left, right } from '@/core/either'
import { Stock } from '@/domain/pharma/enterprise/entities/stock'
import { Injectable } from '@nestjs/common'
import { StocksRepository } from '../../../repositories/stocks-repository'
import { OperatorsRepository } from '../../../repositories/operators-repository'
import { ForbiddenError } from '@/core/erros/errors/forbidden-error'
import { InstitutionsRepository } from '../../../repositories/institutions-repository'

interface FetchStocksUseCaseRequest {
  page: number
  operatorId: string
  institutionsIds?: string[]
}

type FetchStocksUseCaseResponse = Either<
  ForbiddenError,
  {
    stocks: Array<{ stock: Stock } & { institutionName: string | null }>
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

    const stocks = await this.stocksRepository.findManyWithInstitution(
      {
        page,
      },
      institutionsIds ?? [],
      operator?.isSuperAdmin(),
    )

    return right({
      stocks,
    })
  }
}

// import { Either, left, right } from '@/core/either'
// import { Stock } from '@/domain/pharma/enterprise/entities/stock'
// import { Injectable } from '@nestjs/common'
// import { StocksRepository } from '../../../repositories/stocks-repository'
// import { OperatorsRepository } from '../../../repositories/operators-repository'
// import { UniqueEntityId } from '@/core/entities/unique-entity-id'
// import { ForbiddenError } from '@/core/erros/errors/forbidden-error'

// interface FetchStocksUseCaseRequest {
//   page: number
//   operatorId: string
//   institutionsIds?: string[]
// }

// type FetchStocksUseCaseResponse = Either<
// ForbiddenError,
//   {
//     stocks: Stock[]
//   }
// >

// @Injectable()
// export class FetchStocksUseCase {
//   constructor(
//     private stocksRepository: StocksRepository,
//     private operatorsRepository: OperatorsRepository,
//   ) {}

//   async execute({
//     page,
//     operatorId,
//     institutionsIds,
//   }: FetchStocksUseCaseRequest): Promise<FetchStocksUseCaseResponse> {
//     const operator = await this.operatorsRepository.findById(operatorId)
//     if (institutionsIds) {
//       const institutionsIdsByOperator = operator?.institutionsIds
//       for (const item of institutionsIds) {
//         if (!institutionsIdsByOperator?.includes(new UniqueEntityId(item))) {
//           return left(new ForbiddenError())
//         }
//       }
//     }
//     const stocks = await this.stocksRepository.findManyWithInstituion(
//       {
//         page,
//       },
//       institutionsIds ?? operator?.institutionsIds?.map(item => item.toString()))

//     return right({
//       stocks,
//     })
//   }
// }
