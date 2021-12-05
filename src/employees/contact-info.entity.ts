import { InjectRepository } from "@nestjs/typeorm";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Repository } from "typeorm";
import { EmployeeEntity } from "./employee.entity";

@Entity('CONTACTINFO')
export class ContactInfo{
    // @InjectRepository(ContactInfo) private contactInfoRepository: Repository<ContactInfo>

    @PrimaryGeneratedColumn()
    ID:number

    @Column('varchar2',{
        nullable:true,
        length: 20
    })
    FIRST_NAME : string

    @Column('varchar2',{
        nullable:true,
        length: 25
    })
    LAST_NAME : string

    @Column('varchar2',{
        nullable:true,
        length: 20
    })
    PHONE_NUMBER: string

    @Column('varchar2',{
        nullable:true,
        length: 25
    })
    EMAIL : string
    
    @Column({ nullable:true ,type: 'date' })
    HIRE_DATE : Date
    
    @Column('varchar2',{
        nullable:true,
        length: 10
    })
    JOB_ID : string

    @Column({nullable:true})
    SALARY : Number

    @Column({nullable:true})
    COMMISSION_PCT : Number

    @Column({nullable:true})
    PICTURE : string

    @Column({nullable:true})
    BBX : string

    @Column({nullable:true})
    ADDRESS : string

    @ManyToOne(()=>EmployeeEntity, employee => employee.contactInfo,{onDelete:'CASCADE'})
    @JoinColumn({ name: "employeeID" })
    employee: EmployeeEntity
}