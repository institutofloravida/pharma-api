import { UseCaseError } from '@/core/erros/use-case-error';

export class EntryNotFoundError extends Error implements UseCaseError {
  constructor(entryId: string) {
    super(`Entrada "${entryId}" não encontrada.`);
  }
}
