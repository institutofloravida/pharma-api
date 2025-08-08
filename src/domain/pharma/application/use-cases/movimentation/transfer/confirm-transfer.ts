import { left, right, type Either } from '@/core/either';
import {
  Transfer,
  TransferStatus,
} from '../../../../enterprise/entities/transfer';
import { Injectable } from '@nestjs/common';
import { TransferRepository } from '../../../repositories/transfer-repository';
import { TransferNotFoundError } from './_erros/transfer-not-found-error';
import { RegisterMedicineEntryUseCase } from '../entry/register-medicine-entry';
import { MovimentationRepository } from '../../../repositories/movimentation-repository';
import { MedicinesExitsRepository } from '../../../repositories/medicines-exits-repository';
import { BatchStocksRepository } from '../../../repositories/batch-stocks-repository';
import { EntryType } from '@/domain/pharma/enterprise/entities/entry';
import { BatchesRepository } from '../../../repositories/batches-repository';

interface confirmTransferUseCaseRequest {
  transferId: string;
  operatorId: string;
}

type confirmTransferUseCaseResponse = Either<
  Error,
  {
    transfer: Transfer;
  }
>;

@Injectable()
export class ConfirmTransferUseCase {
  constructor(
    private transferRepository: TransferRepository,
    private movimentationRepository: MovimentationRepository,
    private exitsRepository: MedicinesExitsRepository,
    private registerEntryUseCase: RegisterMedicineEntryUseCase,
    private batchStocksRepository: BatchStocksRepository,
    private batchesRepository: BatchesRepository,
  ) {}

  async execute({
    operatorId,
    transferId,
  }: confirmTransferUseCaseRequest): Promise<confirmTransferUseCaseResponse> {
    const transfer = await this.transferRepository.findById(transferId);

    if (!transfer) {
      return left(new TransferNotFoundError(transferId));
    }

    if (transfer.status !== TransferStatus.PENDING) {
      return left(new Error('Transfer already completed'));
    }

    const exit = await this.exitsRepository.findByTransferId(
      transfer.id.toString(),
    );

    if (!exit) {
      return left(new Error('Exit not found for this transfer'));
    }

    const movimentations =
      await this.movimentationRepository.fetchMovimentation({
        exitId: exit.id.toString(),
      });

    const medicines: Array<{
      medicineVariantId: string;
      batches: Array<{
        code: string;
        expirationDate: Date;
        manufacturerId: string;
        manufacturingDate?: Date;
        quantityToEntry: number;
      }>;
    }> = [];

    for (const movimentation of movimentations.movimentation) {
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

      if (!batch) {
        continue;
      }

      const medicineAdded = medicines.findIndex(
        (medicine) =>
          medicine.medicineVariantId ===
          movimentation.medicineVariantId.toString(),
      );
      if (medicineAdded !== -1) {
        medicines[medicineAdded].batches.push({
          code: batch.code,
          expirationDate: batch.expirationDate,
          manufacturerId: batch.manufacturerId.toString(),
          manufacturingDate: batch.manufacturingDate ?? undefined,
          quantityToEntry: movimentation.quantity,
        });
      } else {
        medicines.push({
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
      entryType: EntryType.TRANSFER,
      movementTypeId: undefined,
      medicines,
      nfNumber: undefined,
      operatorId,
      stockId: transfer.stockDestinationId.toString(),
      transferId: transfer.id.toString(),
      entryDate: new Date(),
    });

    transfer.status = TransferStatus.CONFIRMED;
    transfer.confirmedAt = new Date();
    await this.transferRepository.save(transfer);

    return right({
      transfer,
    });
  }
}
