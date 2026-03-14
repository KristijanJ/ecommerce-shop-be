import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
      entities: [],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  levelFirst: true,
                  translateTime: 'SYS:HH:MM:ss.l',
                  ignore: 'pid,hostname',
                },
              }
            : undefined,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
