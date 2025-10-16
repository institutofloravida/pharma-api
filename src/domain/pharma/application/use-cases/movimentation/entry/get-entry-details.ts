import { Either, left, right } from '@/core/either';
import { EntryDetails } from '@/domain/pharma/enterprise/entities/value-objects/entry-details';
import { Injectable } from '@nestjs/common';
import { MedicinesEntriesRepository } from '../../../repositories/medicines-entries-repository';

interface GetEntryDetailsUseCaseRequest {
  entryId: string;
}

type GetEntryDetailsUseCaseResponse = Either<
  null,
  {
    entry: EntryDetails;
  }
>;

@Injectable()
export class GetEntryDetailsUseCase {
  constructor(private entriesRepository: MedicinesEntriesRepository) {}

  async execute({
    entryId,
  }: GetEntryDetailsUseCaseRequest): Promise<GetEntryDetailsUseCaseResponse> {
    const entry = await this.entriesRepository.findByIdWithDetails(entryId);

    if (!entry) {
      return left(null);
    }

    return right({
      entry,
    });
  }
}
