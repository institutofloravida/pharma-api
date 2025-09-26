import { UseCaseError } from '@/core/erros/use-case-error';

export class StockAlreadyHasMovimentationError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Já foram registradas movimentações para esse estoque.');
  }
}
