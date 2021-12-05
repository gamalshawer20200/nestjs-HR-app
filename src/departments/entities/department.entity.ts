import { EmployeeEntity } from "src/employees/employee.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { departmentsLocationEnum } from "./departmentsLocation.enum";

@Entity('DEPARTMENTS')
export class DepartmentEntity {

@PrimaryGeneratedColumn()
DEPARTMENT_ID: Number

@Column('varchar2',{
    nullable:true,
    length: 30
})
DEPARTMENT_NAME: string

// @OneToOne(()=>EmployeeEntity,employeeEntity => employeeEntity.MANAGER_ID)
// @JoinColumn()
// MANAGAER_ID: EmployeeEntity

@Column({nullable:true})
LOCATION: departmentsLocationEnum

@OneToMany(()=>EmployeeEntity,employee=>employee.department)
employee:EmployeeEntity[]

}
