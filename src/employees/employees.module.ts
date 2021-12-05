import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactInfo } from './contact-info.entity';
import { EmployeeEntity } from './employee.entity';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';

// import { ContactInfo } from './entities/contact-info.entity';
// import { Meeting } from './entities/meeting.entity';
// import { Task } from './entities/task.entity';



@Module({
  imports:[
    TypeOrmModule.forFeature([EmployeeEntity,ContactInfo]),
  ],
  controllers:[EmployeesController],
  providers: [EmployeesService],
  exports:[EmployeesService]
})
export class EmployeesModule {}
