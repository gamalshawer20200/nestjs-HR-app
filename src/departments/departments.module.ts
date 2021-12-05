import { Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentEntity } from './entities/department.entity';
import { EmployeeEntity } from 'src/employees/employee.entity';

@Module({
  imports:[TypeOrmModule.forFeature([DepartmentEntity,EmployeeEntity])],
  controllers: [DepartmentsController],
  providers: [DepartmentsService]
})
export class DepartmentsModule {}
