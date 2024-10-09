import { InMemoryMedicineStockRepository } from 'test/repositories/in-memory-medicine-stock-repository'
import { CreateMedicineStockUseCase } from './create-medicine-stock'
import { InMemoryStockRepository } from 'test/repositories/in-memory-stock-repository'
import { InMemoryMedicineRepository } from 'test/repositories/in-memory-medicine-repository'
import { InMemoryBatchRepository } from 'test/repositories/in-memory-batch-repository'
import { InMemoryBatchStockRepository } from 'test/repositories/in-memory-batch-stock-repository'
import { makeStock } from 'test/factories/make-stock'
import { makeMedicine } from 'test/factories/make-medicine'

let inMemoryStockRepository: InMemoryStockRepository
let inMemoryMedicineRepository: InMemoryMedicineRepository
let inMemoryBatchRepository: InMemoryBatchRepository
let inMemoryBatchStockRepository: InMemoryBatchStockRepository
let inMemoryMedicineStockRepository: InMemoryMedicineStockRepository
let sut: CreateMedicineStockUseCase

describe('MedicineStock', () => {
  beforeEach(() => {
    inMemoryStockRepository = new InMemoryStockRepository()
    inMemoryMedicineRepository = new InMemoryMedicineRepository()
    inMemoryBatchRepository = new InMemoryBatchRepository()
    inMemoryBatchStockRepository = new InMemoryBatchStockRepository()
    inMemoryMedicineStockRepository = new InMemoryMedicineStockRepository()

    sut = new CreateMedicineStockUseCase(
      inMemoryStockRepository,
      inMemoryMedicineRepository,
      inMemoryBatchRepository,
      inMemoryBatchStockRepository,
      inMemoryMedicineStockRepository,
    )
  })
  it('shoult be able create a medicine stock', async () => {
    const stock = makeStock()
    await inMemoryStockRepository.create(stock)

    const medicine = makeMedicine()
    await inMemoryMedicineRepository.create(medicine)

    const result = await sut.execute({
      code: 'ABCD1',
      quantity: 20,
      manufacturerId: 'manufacturer_1',
      medicineId: medicine.id.toString(),
      stockId: stock.id.toString(),
      expirationDate: new Date('01-01-2024'),
    })
    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryMedicineStockRepository.items).toHaveLength(1)
      expect(inMemoryMedicineStockRepository.items[0].quantity).toBe(result.value?.medicineStock.quantity)
    }
  })
  it('not should allowed duplicity', async () => {
    const stock = makeStock()
    await inMemoryStockRepository.create(stock)

    const medicine = makeMedicine()
    await inMemoryMedicineRepository.create(medicine)

    const result = await sut.execute({
      code: 'ABCD1',
      quantity: 20,
      manufacturerId: 'manufacturer_1',
      medicineId: medicine.id.toString(),
      stockId: stock.id.toString(),
      expirationDate: new Date('01-01-2024'),
    })
    const result2 = await sut.execute({
      code: 'ABCD1',
      quantity: 20,
      manufacturerId: 'manufacturer_1',
      medicineId: medicine.id.toString(),
      stockId: stock.id.toString(),
      expirationDate: new Date('01-01-2024'),
    })
    expect(result2.isLeft()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryMedicineStockRepository.items).toHaveLength(1)
      expect(inMemoryMedicineStockRepository.items[0].id).toBe(result.value?.medicineStock.id)
    }
  })
})
