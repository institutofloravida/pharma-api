import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { TransferRepository } from '../../../repositories/transfer-repository';
import { TransferWithMovimentation } from '@/domain/pharma/enterprise/entities/value-objects/tranfer-with-movimentation';

interface GetTransferUseCaseRequest {
  transferId: string;
}

type GetTransferUseCaseResponse = Either<
  null,
  {
    transfer: TransferWithMovimentation;
  }
>;

@Injectable()
export class GetTransferUseCase {
  constructor(private transferRepository: TransferRepository) {}

  async execute({
    transferId,
  }: GetTransferUseCaseRequest): Promise<GetTransferUseCaseResponse> {
    const transfer =
      await this.transferRepository.findByIdWithMovimentation(transferId);

    if (!transfer) {
      return left(null);
    }

    return right({
      transfer,
    });
  }
}
