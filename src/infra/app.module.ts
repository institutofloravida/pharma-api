import { Module } from '@nestjs/common'
import { HttpModule } from './http/http.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env/env'
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env =>
        envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
  ],
})
export class AppModule {}
