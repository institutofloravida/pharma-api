import {
  BadRequestException,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '@/infra/auth/roles.guard';
import { OperatorRole } from '@/domain/pharma/enterprise/entities/operator';
import { Roles } from '@/infra/auth/role-decorator';
import { ReverseExitUseCase } from '@/domain/pharma/application/use-cases/movimentation/exit/reverse-exit';

@ApiBearerAuth()
@ApiTags('exit')
@Controller('movement/exit/:id/reverse')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(OperatorRole.MANAGER, OperatorRole.SUPER_ADMIN)
@UseGuards(JwtAuthGuard)
export class ReverseExitController {
  constructor(private reverseExitUseCase: ReverseExitUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@CurrentUser() user: UserPayload, @Param('id') exitId: string) {
    const result = await this.reverseExitUseCase.execute({
      operatorId: user.sub,
      exitId,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case ConflictException:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return {};
  }
}
