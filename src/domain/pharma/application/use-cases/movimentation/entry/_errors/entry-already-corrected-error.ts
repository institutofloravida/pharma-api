import { UseCaseError } from '@/core/erros/use-case-error';

export class EntryAlreadyCorrectedError extends Error implements UseCaseError {
  constructor(entryId: string) {
    super(`A entrada "${entryId}" já foi corrigida e não pode ser alterada novamente.`);
  }
}
