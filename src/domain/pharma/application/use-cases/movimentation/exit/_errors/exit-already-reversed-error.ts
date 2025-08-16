import { UseCaseError } from '@/core/erros/use-case-error';

export class ExitAlreadyReversedError extends Error implements UseCaseError {
  constructor(id: string) {
    super(` Saída com id ${id} já foi revertida `);
  }
}
