import { UseCaseError } from '@/core/erros/use-case-error';

export class OperatorIsNotActiveError extends Error implements UseCaseError {
  constructor() {
    super('Operador inativo, contate o administrador do sistema.');
  }
}
