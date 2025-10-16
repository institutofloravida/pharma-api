import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { GetEntryDetailsUseCase } from '@/domain/pharma/application/use-cases/movimentation/entry/get-entry-details';
import { EntryDetailsPresenter } from '@/infra/http/presenters/entry-details-presenter';
@ApiTags('entry')
@Controller('/entry')
export class GetEntryDetailsController {
  constructor(private getEntryDetails: GetEntryDetailsUseCase) {}

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async handle(@Param('id') id: string) {
    const result = await this.getEntryDetails.execute({
      entryId: id,
    });

    if (result.isLeft()) {
      throw new BadRequestException({});
    }

    const { entry } = result.value;

    return {
      entryDetails: EntryDetailsPresenter.toHTTP(entry),
    };
  }
}
