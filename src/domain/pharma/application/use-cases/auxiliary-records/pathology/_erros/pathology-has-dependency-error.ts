import { UseCaseError } from "@/core/erros/use-case-error";

export class PathologyHasDependencyError extends Error implements UseCaseError{
    constructor(){
        super(`Existem pacientes associados a essa patologia!`)
    }
}