import { UseCaseError } from '@/core/erros/use-case-error';

export class ExitNotFoundError extends Error implements UseCaseError {
  constructor(id: string) {
    super(` Saída com id ${id} não foi encontrada `);
  }
}
