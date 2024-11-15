import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/medicines-variants')
export class FetchmedicinevariantsController {
  constructor(private fetchmedicinevariants: FetchMedicineVariantsUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchmedicinevariants.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException({})
    }

    const medicinevariants = result.value.medicinevariants

    return { medicinevariants: medicinevariants.map(MedicineVariantPresenter.toHTTP) }
  }
}
