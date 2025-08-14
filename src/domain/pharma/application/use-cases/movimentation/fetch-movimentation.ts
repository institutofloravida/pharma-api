import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Meta } from '@/core/repositories/meta';
import { MovimentationRepository } from '../../repositories/movimentation-repository';
import { MovimentationDetails } from '@/domain/pharma/enterprise/entities/value-objects/movimentation-details';

interface FetchMovimentationUseCaseRequest {
  institutionId: string;
  page: number;
}

type FetchMovimentationUseCaseResponse = Either<
  null,
  {
    movimentation: MovimentationDetails[];
    meta: Meta;
  }
>;

@Injectable()
export class FetchMovimentationUseCase {
  constructor(private movimentationRepository: MovimentationRepository) {}

  async execute({
    page,
    institutionId,
  }: FetchMovimentationUseCaseRequest): Promise<FetchMovimentationUseCaseResponse> {
    const { movimentation, meta } =
      await this.movimentationRepository.fetchMovimentation(
        {
          institutionId,
        },
        { page },
      );

    return right({
      movimentation,
      meta: {
        page: meta.page,
        totalCount: meta.totalCount,
      },
    });
  }
}
