import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { EmployeesController } from './employees/employees.controller';
import { EmployeesModule } from './employees/employees.module';
// import { EmployeesService } from './employees/employees.service';
import { DepartmentsModule } from './departments/departments.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './shared/http-error.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { RolesGuard } from './shared/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    EmployeesModule,
     DepartmentsModule,
    ],
  controllers: [AppController],
  providers: [
    AppService, 
    RolesGuard,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter, 
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    },
],
})
export class AppModule {}
