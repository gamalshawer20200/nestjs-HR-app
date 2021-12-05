import { PartialType } from '@nestjs/mapped-types';
import { departmentsLocationEnum } from '../entities/departmentsLocation.enum';
import { CreateDepartmentDto } from './create-department.dto';

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {
    
    DEPARTMENT_NAME:string
    
    LOCATION:departmentsLocationEnum
}
