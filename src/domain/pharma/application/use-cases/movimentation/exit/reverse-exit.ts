import { left, right, type Either } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { RegisterMedicineEntryUseCase } from '../entry/register-medicine-entry';
import { MovimentationRepository } from '../../../repositories/movimentation-repository';
import { MedicinesExitsRepository } from '../../../repositories/medicines-exits-repository';
import { BatchStocksRepository } from '../../../repositories/batch-stocks-repository';
import { EntryType } from '@/domain/pharma/enterprise/entities/entry';
import { BatchesRepository } from '../../../repositories/batches-repository';
import { ExitNotFoundError } from './_errors/exit-not-found-error';
import { ExitAlreadyReversedError } from './_errors/exit-already-reversed-error';

interface reverseExitUseCaseRequest {
  exitId: string;
  operatorId: string;
}

type reverseExitUseCaseResponse = Either<Error, null>;

@Injectable()
export class ReverseExitUseCase {
  constructor(
    private movimentationRepository: MovimentationRepository,
    private exitsRepository: MedicinesExitsRepository,
    private registerEntryUseCase: RegisterMedicineEntryUseCase,
    private batchStocksRepository: BatchStocksRepository,
    private batchesRepository: BatchesRepository,
  ) {}

  async execute({
    operatorId,
    exitId,
  }: reverseExitUseCaseRequest): Promise<reverseExitUseCaseResponse> {
    const exit = await this.exitsRepository.findById(exitId);

    if (!exit) {
      return left(new ExitNotFoundError(exitId));
    }
    if (exit.reverseAt) {
      return left(new ExitAlreadyReversedError(exitId));
    }

    const movimentationOfExit =
      await this.movimentationRepository.fetchMovimentation({
        exitId: exit.id.toString(),
      });

    const medicinesToEntry: Array<{
      medicineVariantId: string;
      batches: Array<{
        code: string;
        expirationDate: Date;
        manufacturerId: string;
        manufacturingDate?: Date;
        quantityToEntry: number;
      }>;
    }> = [];

    for (const movimentation of movimentationOfExit.movimentation) {
      const batchStock = await this.batchStocksRepository.findById(
        movimentation.batchStockId.toString(),
      );
      if (!batchStock) {
        continue;
      }

      const batch = await this.batchesRepository.findById(
        batchStock.batchId.toString(),
      );
      if (!batch) {
        continue;
      }

      const medicineAdded = medicinesToEntry.findIndex(
        (medicine) =>
          medicine.medicineVariantId ===
          movimentation.medicineVariantId.toString(),
      );
      if (medicineAdded !== -1) {
        medicinesToEntry[medicineAdded].batches.push({
          code: batch.code,
          expirationDate: batch.expirationDate,
          manufacturerId: batch.manufacturerId.toString(),
          manufacturingDate: batch.manufacturingDate ?? undefined,
          quantityToEntry: movimentation.quantity,
        });
      } else {
        medicinesToEntry.push({
          medicineVariantId: movimentation.medicineVariantId.toString(),
          batches: [
            {
              code: batch.code,
              expirationDate: batch.expirationDate,
              manufacturerId: batch.manufacturerId.toString(),
              manufacturingDate: batch.manufacturingDate ?? undefined,
              quantityToEntry: movimentation.quantity,
            },
          ],
        });
      }
    }

    await this.registerEntryUseCase.execute({
      entryType: EntryType.INVENTORY,
      movementTypeId: undefined,
      medicines: medicinesToEntry,
      nfNumber: undefined,
      operatorId,
      stockId: exit.stockId.toString(),
      transferId: undefined,
      entryDate: new Date(),
    });

    exit.reverseAt = new Date();

    await this.exitsRepository.save(exit);

    return right(null);
  }
}
