import { UseCaseError } from '@/core/erros/use-case-error';

export class PathologyHasDependencyError extends Error implements UseCaseError {
  constructor() {
    super('Existem usuários associados a essa patologia!');
  }
}
