import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { RegisterMedicineEntryUseCase } from '@/domain/pharma/application/use-cases/movimentation/register-medicine-entry'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { z } from 'zod'

const registerMedicineEntryBodySchema = z.object({
  batches: z
    .array(
      z.object({
        batchId: z.string(),
        quantityToEntry: z.number(),
      }),
    )
    .optional(),
  movementTypeId: z.string(),
  entryDate: z.coerce.date().optional(),
  newBatches: z
    .array(
      z.object({
        code: z.string(),
        expirationDate: z.coerce.date(),
        manufacturerId: z.string(),
        manufacturingDate: z.coerce.date(),
        quantityToEntry: z.number(),
      }),
    )
    .optional(),
})

const bodyValidationPipe = new ZodValidationPipe(registerMedicineEntryBodySchema)

type RegisterMedicineEntryBodySchema = z.infer<
  typeof registerMedicineEntryBodySchema
>

@Controller('/medicine-variant/:medicineVariantId/entry/:stockId')
@UseGuards(JwtAuthGuard)
export class RegisterMedicineEntryController {
  constructor(private registerMedicineEntry: RegisterMedicineEntryUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('medicineVariantId') medicineVariantId: string,
    @Param('stockId') stockId: string,
    @Body(bodyValidationPipe) body: RegisterMedicineEntryBodySchema,
  ) {
    const { batches, entryDate, movementTypeId, newBatches } = body

    const result = await this.registerMedicineEntry.execute({
      batches,
      movementTypeId,
      medicineVariantId,
      operatorId: user.sub,
      stockId,
      entryDate,
      newBatches,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ConflictException:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {}
  }
}
