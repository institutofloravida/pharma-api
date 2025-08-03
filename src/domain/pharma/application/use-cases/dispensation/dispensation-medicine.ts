import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { MedicinesStockRepository } from '../../repositories/medicines-stock-repository'
import { MedicinesRepository } from '../../repositories/medicines-repository'
import { BatchesRepository } from '../../repositories/batches-repository'
import { NoBatchInStockFoundError } from '../_errors/no-batch-in-stock-found-error'
import { InsufficientQuantityInStockError } from '../_errors/insufficient-quantity-in-stock-error'
import { InsufficientQuantityBatchInStockError } from '../_errors/insufficient-quantity-batch-in-stock-error'
import { ExitType, MedicineExit } from '../../../enterprise/entities/exit'
import { MedicinesExitsRepository } from '../../repositories/medicines-exits-repository'
import { Dispensation } from '../../../enterprise/entities/dispensation'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DispensationsMedicinesRepository } from '../../repositories/dispensations-medicines-repository'
import { ExpiredMedicineDispenseError } from '../_errors/expired-medicine-dispense-error'
import { Injectable } from '@nestjs/common'
import { BatchStocksRepository } from '../../repositories/batch-stocks-repository'
import { MedicinesVariantsRepository } from '../../repositories/medicine-variant-repository'
import { MedicineStockNotFoundError } from '../stock/medicine-stock/_errors/medicine-stock-not-found-error'
import { Movimentation } from '@/domain/pharma/enterprise/entities/movimentation'
import { MovimentationRepository } from '../../repositories/movimentation-repository'

interface DispensationMedicineUseCaseRequest {
  patientId: string;
  operatorId: string;
  medicines: {
    medicineStockId: string;
    batchesStocks: { batchStockId: string; quantity: number }[];
  }[];
  stockId: string;
  dispensationDate?: Date;
}

type DispensationMedicineUseCaseResponse = Either<
  | ResourceNotFoundError
  | InsufficientQuantityInStockError
  | NoBatchInStockFoundError
  | InsufficientQuantityBatchInStockError
  | ExpiredMedicineDispenseError,
  {
    dispensation: Dispensation;
  }
>

@Injectable()
export class DispensationMedicineUseCase {
  constructor(
    private dispensationsMedicinesRepository: DispensationsMedicinesRepository,
    private medicinesExitsRepository: MedicinesExitsRepository,
    private medicinesRepository: MedicinesRepository,
    private medicinesVariantsRepository: MedicinesVariantsRepository,
    private medicinesStockRepository: MedicinesStockRepository,
    private batchestockskRepository: BatchStocksRepository,
    private batchesRepository: BatchesRepository,
    private movimentationRepository: MovimentationRepository,
  ) {}

  async execute({
    patientId,
    operatorId,
    dispensationDate,
    medicines,
    stockId,
  }: DispensationMedicineUseCaseRequest): Promise<DispensationMedicineUseCaseResponse> {
    const dispensation = Dispensation.create({
      patientId: new UniqueEntityId(patientId),
      dispensationDate,
      operatorId: new UniqueEntityId(operatorId),
    })

    await this.dispensationsMedicinesRepository.create(dispensation)

    const medicineExit = MedicineExit.create({
      exitDate: dispensationDate,
      exitType: ExitType.DISPENSATION,
      operatorId: new UniqueEntityId(operatorId),
      dispensationId: dispensation.id,
      stockId: new UniqueEntityId(stockId),
    })

    await this.medicinesExitsRepository.create(medicineExit)

    for await (const medicineStockToDispensation of medicines) {
      const medicineStock =
      await this.medicinesStockRepository.findById(medicineStockToDispensation.medicineStockId)
      if (!medicineStock) {
        return left(new MedicineStockNotFoundError(medicineStockToDispensation.medicineStockId))
      }
      const medicineVariant = await this.medicinesVariantsRepository.findById(
        medicineStock.medicineVariantId.toString(),
      )
      if (!medicineVariant) {
        return left(new ResourceNotFoundError())
      }
      const medicine = await this.medicinesRepository.findById(
        medicineVariant.medicineId.toString(),
      )
      if (!medicine) {
        return left(new ResourceNotFoundError())
      }

      // const totalQuantityToDispense = 0

      for (const batcheStockToDispensation of medicineStockToDispensation.batchesStocks) {
        const batchestock = await this.batchestockskRepository.findById(
          batcheStockToDispensation.batchStockId,
        )
        if (!batchestock) {
          return left(new ResourceNotFoundError())
        }

        const batch = await this.batchesRepository.findById(
          batchestock.batchId.toString(),
        )
        if (!batch) {
          return left(new ResourceNotFoundError())
        }

        const expirationDate = new Date(batch.expirationDate)

        if (expirationDate <= new Date()) {
          return left(
            new ExpiredMedicineDispenseError(batch.code, medicine.content),
          )
        }

        if (batchestock.quantity < batcheStockToDispensation.quantity) {
          return left(
            new InsufficientQuantityBatchInStockError(
              medicine.content,
              batch.code,
              batchestock.quantity,
            ),
          )
        }

        // totalQuantityToDispense += batcheStockToDispensation.quantity

        const batchStock = await this.batchestockskRepository.findById(
          batcheStockToDispensation.batchStockId,
        )
        if (!batchStock) {
          return left(new ResourceNotFoundError())
        }

        await Promise.all([
          this.batchestockskRepository.subtract(
            batcheStockToDispensation.batchStockId.toString(),
            batcheStockToDispensation.quantity,
          ),
          this.medicinesStockRepository.subtract(
            medicineStock.id.toString(),
            batcheStockToDispensation.quantity,
          ),
        ])

        const movimentation = Movimentation.create({
          batchStockId: new UniqueEntityId(batcheStockToDispensation.batchStockId),
          exitId: medicineExit.id,
          quantity: batcheStockToDispensation.quantity,
          direction: 'EXIT',
          entryId: undefined,
          movementTypeId: undefined,
        })

        await this.movimentationRepository.create(movimentation)
      }
    }

    return right({ dispensation })
  }
}
