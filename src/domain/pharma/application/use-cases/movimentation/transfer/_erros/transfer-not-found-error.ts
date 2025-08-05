import { UseCaseError } from '@/core/erros/use-case-error';

export class TransferNotFoundError extends Error implements UseCaseError {
  constructor(transferId: string) {
    super(`Transferência com id ${transferId} não encontrada!`);
  }
}
