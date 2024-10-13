import { left, right, type Either } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MedicineStock } from '../../enterprise/entities/medicine-stock'
import type { MedicineStockRepository } from '../repositories/medicines-stock-repository'
import type { MedicineRepository } from '../repositories/medicines-repository'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import type { StockRepository } from '../repositories/stocks-repository'
import { BatchStock } from '../../enterprise/entities/batch-stock'
import type { BatchRepository } from '../repositories/batchs-repository'
import { Batch } from '../../enterprise/entities/batch'
import type { BatchStockRepository } from '../repositories/batch-stocks-repository'
import { MedicineStockAlreadyExistsError } from './_errors/medicine-stock-already-exists-error'

interface createMedicineStockUseCaseRequest {
  medicineId: string,
  stockId: string
  quantity: number

  code: string
  expirationDate: Date,
  manufacturerId: string,
  manufacturingDate?: Date,
}

type createMedicineStockUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    medicineStock: MedicineStock
  }

>
export class CreateMedicineStockUseCase {
  constructor(
    private stockRepository: StockRepository,
    private medicineRepository: MedicineRepository,
    private batchRepository: BatchRepository,
    private batchStockRepository: BatchStockRepository,
    private medicinestockRepository: MedicineStockRepository,
  ) {}

  async execute({
    medicineId,
    stockId,
    quantity,
    code,
    expirationDate,
    manufacturerId,
    manufacturingDate,

  }: createMedicineStockUseCaseRequest): Promise<createMedicineStockUseCaseResponse> {
    const [medicine, stock] = await Promise.all([
      this.medicineRepository.findById(medicineId),
      this.stockRepository.findById(stockId),
    ])

    if (!medicine || !stock) {
      return left(new ResourceNotFoundError())
    }

    const batch = Batch.create({
      code,
      expirationDate,
      manufacturerId: new UniqueEntityId(manufacturerId),
      manufacturingDate,
    })

    const batchStock = BatchStock.create({
      batchId: batch.id,
      currentQuantity: quantity,
      stockId: new UniqueEntityId(stockId),
      lastMove: new Date(),
    })

    const medicineStock = MedicineStock.create({
      medicineId: new UniqueEntityId(medicineId),
      stockId: new UniqueEntityId(stockId),
      currentQuantity: quantity,
      batchsStockIds: [batchStock.id.toString()],
    })

    const medicineStockExists = await this.medicinestockRepository.medicineStockExists(medicineStock)

    if (medicineStockExists) {
      return left(new MedicineStockAlreadyExistsError(medicineStockExists.id.toString()))
    }

    await Promise.all([
      this.batchRepository.create(batch),
      this.batchStockRepository.create(batchStock),
      this.medicinestockRepository.create(medicineStock),
    ])

    return right({
      medicineStock,
    })
  }
}
