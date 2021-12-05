import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Repository } from "typeorm";
// import { ContactInfo } from "./contact-info.entity";
// import { Meeting } from "./meeting.entity";
// import { Task } from "./task.entity";
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { ContactInfo } from "./contact-info.entity";
import { DepartmentEntity } from "src/departments/entities/department.entity";
import { ManagerTypeEntity } from "./managerType.entity";
import { Role } from "src/shared/role.enum";


@Entity('EMPLOYEES')
export class EmployeeEntity{
    // @InjectRepository(Employee) private employeeRepo: Repository<Employee>

    @PrimaryGeneratedColumn()
    EMPLOYEE_ID : Number
    
    @Column('varchar2',{
        nullable:true,
        length: 10
    })
    JOB_ID : string

    @Column({nullable:true})
    username:string

    @Column({nullable:true})
    password:string

    @Column({
        type: 'number',
        default: 0
    })
    isDeleted: number
    
    @OneToMany(()=>EmployeeEntity,employee=>employee.MANAGER_ID)
    directReports:EmployeeEntity[]

    @ManyToOne(()=>EmployeeEntity, employee=>employee.directReports,{onDelete:'SET NULL'})
    @JoinColumn({name:'managerID'})
    MANAGER_ID : EmployeeEntity


    @ManyToOne(()=>DepartmentEntity, department=>department.employee,{onDelete:'SET NULL'})
    @JoinColumn({ name: "departmentID" })
    department : DepartmentEntity

    @OneToMany(()=>ContactInfo,contactInfo => contactInfo.employee)
    contactInfo: ContactInfo[]

    @ManyToOne(()=> ManagerTypeEntity, type => type.managerType)
    @JoinColumn({name:"managerType"})
    managerType: ManagerTypeEntity

    @Column({
        type: 'varchar2',
        default: Role.USER
    })
    role: Role



    @BeforeInsert()
    async hashPassword(){
        this.password = await bcrypt.hash(this.password, 10)
    }

    async hashpw(password) {
        return await bcrypt.hash(password, 10)
    }

    toResponseObject(showToken: boolean= true){
        const {EMPLOYEE_ID, username, token,role} = this
        const responseObject =  {EMPLOYEE_ID, username, token, role}
        responseObject.token = token

        if(!showToken){
            delete responseObject.token
        }
        return responseObject
    }

    async comparePassword(attempt:string){        
        return await bcrypt.compare(attempt,this.password)
    }

    private get token(){
        const {EMPLOYEE_ID,username,role}= this
        // console.log(this)
        return jwt.sign({
            EMPLOYEE_ID,username,role
        },process.env.SECRET, {expiresIn: '7d'})
    }



    //--------------------------------------------------------------

    // @PrimaryGeneratedColumn()
    // id:number

    // @Column({unique: true, nullable:true})
    // username:string
    
    // @Column({nullable:true})
    // password:string

    // @ManyToOne(()=>EmployeeEntity, employee=>employee.directReports,{onDelete:'SET NULL'})
    // manager:EmployeeEntity

    // @OneToMany(()=>EmployeeEntity,employee=>employee.manager)
    // directReports:EmployeeEntity[]

    // @OneToOne(()=>ContactInfo,contactInfo => contactInfo.employee)
    // contactInfo: ContactInfo

    // @OneToMany(()=>Task, task => task.employee)
    // tasks:Task[]

    // @ManyToMany(()=>Meeting,meeting=>meeting.attendees)
    // @JoinTable()
    // meetings: Meeting[]
    
    // @CreateDateColumn()
    // created:Date

    // @BeforeInsert()
    // async hashPassword(){
    //     this.password = await bcrypt.hash(this.password, 10)
    // }

    // toResponseObject(showToken: boolean= true){
    //     const {id, username, created, token} = this
    //     const responseObject =  {id,created,username, token}
    //     responseObject.token = token

    //     if(!showToken){
    //         delete responseObject.token
    //     }
    //     return responseObject
    // }

    // async comparePassword(attempt:string){
    //     return await bcrypt.compare(attempt,this.password)
    // }

    // private get token(){
    //     const {id,username}= this
    //     return jwt.sign({
    //         id,username
    //     },process.env.SECRET, {expiresIn: '7d'})
    // }
}