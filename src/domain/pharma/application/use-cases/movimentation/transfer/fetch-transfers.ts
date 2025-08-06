import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Meta } from '@/core/repositories/meta';
import { TransferStatus } from '@/domain/pharma/enterprise/entities/transfer';
import { TransferDetails } from '@/domain/pharma/enterprise/entities/value-objects/tranfer-details';
import { TransferRepository } from '../../../repositories/transfer-repository';

interface FetchTransfersUseCaseRequest {
  page: number;
  institutionId: string;
  operatorId?: string;
  status?: TransferStatus;
  transferDate?: Date;
}

type FetchTransfersUseCaseResponse = Either<
  null,
  {
    transfers: TransferDetails[];
    meta: Meta;
  }
>;

@Injectable()
export class FetchTransfersUseCase {
  constructor(private transferRepository: TransferRepository) {}

  async execute({
    page,
    institutionId,
    operatorId,
    status,
    transferDate,
  }: FetchTransfersUseCaseRequest): Promise<FetchTransfersUseCaseResponse> {
    const { transfers, meta } = await this.transferRepository.findMany(
      { page },
      {
        institutionId,
        operatorId,
        status,
        transferDate,
      },
    );

    return right({
      transfers,
      meta: {
        page: meta.page,
        totalCount: meta.totalCount,
      },
    });
  }
}
