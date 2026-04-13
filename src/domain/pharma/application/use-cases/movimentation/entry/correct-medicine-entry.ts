import { left, right, type Either } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  EntryType,
  MedicineEntry,
} from '@/domain/pharma/enterprise/entities/entry';
import { Movimentation } from '@/domain/pharma/enterprise/entities/movimentation';
import { MedicinesEntriesRepository } from '../../../repositories/medicines-entries-repository';
import { MovimentationRepository } from '../../../repositories/movimentation-repository';
import { BatchStocksRepository } from '../../../repositories/batch-stocks-repository';
import { MedicinesStockRepository } from '../../../repositories/medicines-stock-repository';
import { EntryNotFoundError } from './_errors/entry-not-found-error';
import { EntryAlreadyCorrectedError } from './_errors/entry-already-corrected-error';
import { InsufficientStockForCorrectionError } from './_errors/insufficient-stock-for-correction-error';

interface CorrectMedicineEntryUseCaseRequest {
  entryId: string;
  operatorId: string;
  corrections: Array<{
    movimentationId: string;
    newQuantity: number;
  }>;
  nfNumber?: string;
  entryDate?: Date;
  movementTypeId?: string;
}

type CorrectMedicineEntryUseCaseResponse = Either<
  | EntryNotFoundError
  | EntryAlreadyCorrectedError
  | InsufficientStockForCorrectionError,
  null
>;

@Injectable()
export class CorrectMedicineEntryUseCase {
  constructor(
    private entriesRepository: MedicinesEntriesRepository,
    private movimentationRepository: MovimentationRepository,
    private batchStocksRepository: BatchStocksRepository,
    private medicinesStockRepository: MedicinesStockRepository,
  ) {}

  async execute({
    entryId,
    operatorId,
    corrections,
    nfNumber,
    entryDate,
    movementTypeId,
  }: CorrectMedicineEntryUseCaseRequest): Promise<CorrectMedicineEntryUseCaseResponse> {
    const entry = await this.entriesRepository.findById(entryId);

    if (!entry) {
      return left(new EntryNotFoundError(entryId));
    }

    if (entry.entryType === EntryType.CORRECTION) {
      return left(new EntryAlreadyCorrectedError(entryId));
    }

    const { movimentation: originalMovimentations } =
      await this.movimentationRepository.fetchMovimentation({ entryId });

    // Deltas acumulados de correções anteriores, por batchStockId
    const previousDeltas =
      await this.movimentationRepository.fetchCorrectionDeltas(entryId);

    const effectiveQuantity = (mov: { batchStockId: { toString(): string }; quantity: number }) =>
      mov.quantity + (previousDeltas.get(mov.batchStockId.toString()) ?? 0);

    // Pré-validar todos os deltas negativos antes de aplicar qualquer mudança
    for (const correction of corrections) {
      const originalMov = originalMovimentations.find(
        (m) => m.id.toString() === correction.movimentationId,
      );
      if (!originalMov) continue;

      const delta = correction.newQuantity - effectiveQuantity(originalMov);

      if (delta < 0) {
        const batchStock = await this.batchStocksRepository.findById(
          originalMov.batchStockId.toString(),
        );
        if (!batchStock) continue;

        const reduction = Math.abs(delta);
        if (batchStock.quantity < reduction) {
          return left(
            new InsufficientStockForCorrectionError(
              originalMov.batchCode,
              batchStock.quantity,
              reduction,
            ),
          );
        }
      }
    }

    // Criar o registro de correção
    const correctionEntry = MedicineEntry.create({
      entryType: EntryType.CORRECTION,
      correctionOfEntryId: new UniqueEntityId(entryId),
      operatorId: new UniqueEntityId(operatorId),
      stockId: entry.stockId,
      entryDate: new Date(),
    });

    await this.entriesRepository.create(correctionEntry);

    // Aplicar cada correção
    for (const correction of corrections) {
      const originalMov = originalMovimentations.find(
        (m) => m.id.toString() === correction.movimentationId,
      );
      if (!originalMov) continue;

      const delta = correction.newQuantity - effectiveQuantity(originalMov);
      if (delta === 0) continue;

      const batchStockId = originalMov.batchStockId.toString();
      const medicineStockId = originalMov.medicineStockId.toString();
      const absDelta = Math.abs(delta);

      if (delta > 0) {
        await Promise.all([
          this.batchStocksRepository.replenish(batchStockId, absDelta),
          this.medicinesStockRepository.replenish(medicineStockId, absDelta),
        ]);

        const movimentation = Movimentation.create({
          direction: 'ENTRY',
          entryId: correctionEntry.id,
          batchStockId: originalMov.batchStockId,
          quantity: absDelta,
        });
        await this.movimentationRepository.create(movimentation);
      } else {
        await Promise.all([
          this.batchStocksRepository.subtract(batchStockId, absDelta),
          this.medicinesStockRepository.subtract(medicineStockId, absDelta),
        ]);

        const movimentation = Movimentation.create({
          direction: 'EXIT',
          correctionEntryId: correctionEntry.id,
          batchStockId: originalMov.batchStockId,
          quantity: absDelta,
        });
        await this.movimentationRepository.create(movimentation);
      }
    }

    // Atualizar metadata opcional da entrada original
    if (nfNumber !== undefined) entry.nfNumber = nfNumber;
    if (entryDate !== undefined) entry.entryDate = entryDate;
    if (movementTypeId !== undefined) {
      entry.movementTypeId = new UniqueEntityId(movementTypeId);
    }

    entry.correctedAt = new Date();
    await this.entriesRepository.save(entry);

    return right(null);
  }
}
