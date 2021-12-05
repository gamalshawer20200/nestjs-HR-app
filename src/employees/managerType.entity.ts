import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Repository } from "typeorm";
import { ContactInfo } from "./contact-info.entity";
import { DepartmentEntity } from "src/departments/entities/department.entity";
import { EmployeeEntity } from "./employee.entity";

@Entity('MANAGER_TYPE')
export class ManagerTypeEntity{

    @PrimaryGeneratedColumn()
    ID : Number
    
    @Column('varchar2',{
        nullable:true,
        length: 30
    })
    MANAGER_TYPE_NAME : string

    @OneToMany(()=>EmployeeEntity, employee => employee.managerType,{onDelete:'CASCADE'})
    managerType: EmployeeEntity[]


}