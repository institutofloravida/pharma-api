import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { MetaReport } from '@/core/repositories/meta';
import { MovimentationDetails } from '@/domain/pharma/enterprise/entities/value-objects/movimentation-details';
import { ExitWithStock } from '@/domain/pharma/enterprise/entities/value-objects/exit-with-stock';
import { MovimentationRepository } from '../../repositories/movimentation-repository';
import { MedicinesExitsRepository } from '../../repositories/medicines-exits-repository';
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error';
import { ExitType } from '@/domain/pharma/enterprise/entities/exit';
import { TransferStatus } from '@/domain/pharma/enterprise/entities/transfer';

interface GetExitByDonationUseCaseRequest {
  exitId: string;
}

type GetExitByDonationUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    exit: ExitWithStock;
    movimentation: MovimentationDetails[];
    meta: MetaReport;
  }
>;

@Injectable()
export class GetExitByDonationUseCase {
  constructor(
    private exitsRepository: MedicinesExitsRepository,
    private movimentationRepository: MovimentationRepository,
  ) {}

  async execute({
    exitId,
  }: GetExitByDonationUseCaseRequest): Promise<GetExitByDonationUseCaseResponse> {
    const exit = await this.exitsRepository.findByIdWithStock(exitId);
    if (!exit) {
      return left(new ResourceNotFoundError('Exit not found'));
    }

    const isDonation = exit.exitType === ExitType.DONATION;
    const isConfirmedTransfer =
      exit.exitType === ExitType.TRANSFER &&
      exit.transferStatus === TransferStatus.CONFIRMED;

    if (!isDonation && !isConfirmedTransfer) {
      return left(
        new ResourceNotFoundError(
          'Exit is not a donation or confirmed transfer',
        ),
      );
    }

    const { movimentation, meta } =
      await this.movimentationRepository.fetchMovimentation({
        exitId,
      });

    return right({
      exit,
      meta: {
        totalCount: meta.totalCount,
      },
      movimentation,
    });
  }
}
