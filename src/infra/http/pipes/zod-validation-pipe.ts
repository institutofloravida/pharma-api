import {
  BadRequestException,
  PipeTransform,
} from '@nestjs/common'
import { ZodSchema, ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
  constructor(
    private schema: ZodSchema,
  ) { }

  transform(value: unknown) {
    console.log('Valor recebido no ZodValidationPipe:', value)
    try {
      return this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('Erro de validação Zod:', error.errors)
        throw new BadRequestException({
          erros: fromZodError(error),
          message: 'Validation Failed',
          statusCode: 400,
        })
      }
      throw new BadRequestException('Validation failed')
    }
  }
}
