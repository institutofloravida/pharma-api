import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { Roles } from '@/infra/auth/role-decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator';
import { ActivateOperatorUseCase } from '@/domain/pharma/application/use-cases/operator/activate-operator';

@ApiTags('operator')
@ApiBearerAuth()
@Controller('/operator')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(OperatorRole.MANAGER, OperatorRole.SUPER_ADMIN)
export class ActivateOperatorController {
  constructor(private activateOperator: ActivateOperatorUseCase) {}

  @Patch('/:id/activate')
  @HttpCode(200)
  async handle(@Param('id') operatorId: string) {
    const result = await this.activateOperator.execute({
      operatorId,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }
  }
}
