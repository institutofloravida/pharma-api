import { left, right, type Either } from '@/core/either'
import { ConflictError } from '@/core/erros/errors/conflict-error'

import { Stock } from '../../../enterprise/entities/stock'
import { StocksRepository } from '../../repositories/stocks-repository'
import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InstitutionsRepository } from '../../repositories/institutions-repository'
import { InstitutionNotExistsError } from './institution/_errors/institution-not-exists-error'

interface createStockUseCaseRequest {
  content: string
  status?: boolean
  institutionId: string
}

type createStockUseCaseResponse = Either<
  ConflictError | InstitutionNotExistsError,
  {
    stock: Stock
  }
>

@Injectable()
export class CreateStockUseCase {
  constructor(
    private stockRepository: StocksRepository,
    private institutionsRepository: InstitutionsRepository,
  ) {}

  async execute({
    content,
    status,
    institutionId,
  }: createStockUseCaseRequest): Promise<createStockUseCaseResponse> {
    const institution = await this.institutionsRepository.findById(institutionId)
    if (!institution) {
      return left(new InstitutionNotExistsError())
    }

    const stock = Stock.create({
      content,
      status,
      institutionId: new UniqueEntityId(institutionId),
    })
    const stockExists = await this.stockRepository.findByContent(content, institutionId)
    if (stockExists) {
      return left(new ConflictError())
    }

    await this.stockRepository.create(stock)

    return right({
      stock,
    })
  }
}
