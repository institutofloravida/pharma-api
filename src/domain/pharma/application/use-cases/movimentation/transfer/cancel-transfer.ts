import { left, right, type Either } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { TransferRepository } from '../../../repositories/transfer-repository';
import { MedicinesExitsRepository } from '../../../repositories/medicines-exits-repository';
import { TransferStatus } from '@/domain/pharma/enterprise/entities/transfer';
import { TransferNotFoundError } from './_erros/transfer-not-found-error';
import { ReverseExitUseCase } from '../exit/reverse-exit';

interface CancelTransferUseCaseRequest {
  transferId: string;
  operatorId: string;
}

type CancelTransferUseCaseResponse = Either<Error, null>;

@Injectable()
export class CancelTransferUseCase {
  constructor(
    private transferRepository: TransferRepository,
    private exitsRepository: MedicinesExitsRepository,
    private reverseExitUseCase: ReverseExitUseCase,
  ) {}

  async execute({
    transferId,
    operatorId,
  }: CancelTransferUseCaseRequest): Promise<CancelTransferUseCaseResponse> {
    const transfer = await this.transferRepository.findById(transferId);

    if (!transfer) {
      return left(new TransferNotFoundError(transferId));
    }

    if (transfer.status === TransferStatus.CANCELED) {
      return left(new Error('Transfer already cancelled'));
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

    if (exit.reverseAt) {
      // Exit already reversed — just mark transfer as cancelled
      transfer.status = TransferStatus.CANCELED;
      await this.transferRepository.save(transfer);
      return right(null);
    }

    // Reversing the exit will also cancel the transfer (handled in ReverseExitUseCase)
    const reverseResult = await this.reverseExitUseCase.execute({
      exitId: exit.id.toString(),
      operatorId,
    });

    if (reverseResult.isLeft()) {
      return left(reverseResult.value);
    }

    return right(null);
  }
}
