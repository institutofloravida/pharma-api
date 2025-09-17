import { UseCaseError } from '@/core/erros/use-case-error';

export class OperatorAlreadyHasCarriedOperationsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Operador já efetuou operações.');
  }
}
