import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ActivitiesModule } from './activities/activities.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.NODE_ENV === 'test' ? 'test.sqlite' : 'database.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    ActivitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
