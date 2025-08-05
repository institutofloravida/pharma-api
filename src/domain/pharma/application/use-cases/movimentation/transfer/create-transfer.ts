import { left, right, type Either } from '@/core/either';
import {
  Transfer,
  TransferStatus,
} from '../../../../enterprise/entities/transfer';
import { Injectable } from '@nestjs/common';
import { TransferRepository } from '../../../repositories/transfer-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ExitType } from '@/domain/pharma/enterprise/entities/exit';
import { RegisterExitUseCase } from '../exit/register-exit';

interface createTransferUseCaseRequest {
  stockDestinationId: string;
  batches: {
    batcheStockId: string;
    quantity: number;
  }[];
  stockId: string;
  operatorId: string;
  exitType: ExitType;
  transferDate?: Date;
}

type createTransferUseCaseResponse = Either<
  Error,
  {
    transfer: Transfer;
  }
>;

@Injectable()
export class CreateTransferUseCase {
  constructor(
    private transferRepository: TransferRepository,
    private registerExitUseCase: RegisterExitUseCase,
  ) {}

  async execute({
    batches,
    exitType,
    operatorId,
    stockId,
    stockDestinationId,
    transferDate,
  }: createTransferUseCaseRequest): Promise<createTransferUseCaseResponse> {
    if (exitType !== ExitType.TRANSFER) {
      return left(new Error('Exit type must be TRANSFER'));
    }
    const transfer = Transfer.create({
      status: TransferStatus.PENDING,
      stockDestinationId: new UniqueEntityId(stockDestinationId),
    });

    await this.transferRepository.create(transfer);

    await this.registerExitUseCase.execute({
      batches,
      exitType,
      operatorId,
      stockId,
      movementTypeId: undefined,
      destinationInstitutionId: undefined,
      exitDate: transferDate,
    });

    return right({
      transfer,
    });
  }
}
