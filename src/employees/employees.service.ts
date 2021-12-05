import { Get, HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactInfo } from './contact-info.entity';
import { EmployeeEntity } from './employee.entity';
import { LoginDTO } from './login.dto';

// const moment = require('moment');

@Injectable()
export class EmployeesService {


    constructor(
    @InjectRepository(EmployeeEntity) 
    private employeeRepository:Repository<EmployeeEntity>,
    // @InjectRepository(Task) 
    // private taskRepo:Repository<Task>,
    // @InjectRepository(Meeting) 
    // private meetingRepo:Repository<Meeting>,
    @InjectRepository(ContactInfo) 
    private contactInfoRepo:Repository<ContactInfo>,

    ){
    }


    async findall(user):Promise<any>{
        const employee=  await this.employeeRepository.find({relations:['contactInfo', 'department'], where:{isDeleted:0}},)
               
        if( !(user.role === 'hr' || user.role === 'admin' ) ){
            console.log('INNN')
            employee.map(item=>  delete item.contactInfo[0].SALARY )
        }
        return employee
    }

    async findallDeletedEmployees():Promise<any>{
        return await this.employeeRepository.find({relations:['contactInfo'], where:{isDeleted:1}},)
    }
    
    //----------------------------------------------------------
    
    // const x = await this.contactInfoRepo.find()
    // const y = this.employeeRepository.find()
    // x.forEach(async item =>{
    //     (await y).forEach(async item2=>{
    //         if(((item.FIRST_NAME).concat(item.LAST_NAME)) === ((item2.FIRST_NAME).concat(item2.LAST_NAME))){
    //             console.log('INN')
    //             item.employee = item2
    //             await this.contactInfoRepo.save(item)
    //         }
    //     })
    // })

    //--------------------------------------------------------------
    
    async login(data:LoginDTO):Promise<any>{
        const{username, password} = data
        const employee = await this.employeeRepository.findOne({where: {username , isDeleted:0}})
        console.log('--->'+{...employee});
        
        if(!employee || !(await employee.comparePassword(password))){
            throw new HttpException('Invalid username/password',HttpStatus.BAD_REQUEST)
        }
        return employee.toResponseObject()
    
    }
    
    // async register(data:LoginDTO){
    //     const {username} = data
    //     let user = await this.employeeRepository.findOne({where:{username}})
    //     if(user){
    //         throw new HttpException('User already exist',HttpStatus.BAD_REQUEST)
    //     }
    //     user = await this.employeeRepository.create(data)
    //     await this.employeeRepository.save(user)
    //     return user.toResponseObject()
        
    // }
    
    
        // async showAll(){
        //     const employees = await this.employeeRepository.find()
        //     // return employees.map(employee=>employee.toResponseObject(false))
        //     return employees
        // }


        async create(data:any){
            console.log('------>',data)
            // let now = m().format('LLLL')
            const x :Date = new Date(data.contactInfo.HIRE_DATE)
            // const formatedDate = m(x).format("DD-MMM-YY")
            data.contactInfo.HIRE_DATE = x

            const employee: any = await this.employeeRepository.create(data)
            employee.department = 9
            await this.employeeRepository.save(employee)
            const datax = data.contactInfo
            datax.employee = employee
            const contactInfo = await this.contactInfoRepo.create(datax)
            await this.contactInfoRepo.save(contactInfo)
            
            console.log(contactInfo);
            
            // console.log(employee)
            // console.log(employee.EMPLOYEE_ID)
            // const r = await this.contactInfoRepo.find({relations:['employee']})
            // console.log(employee)
            // const y = r.filter(item=>{item.employee.EMPLOYEE_ID === employee.EMPLOYEE_ID})
            // console.log(y)
            // const updatedone = await this.employeeRepository.findOne({EMPLOYEE_ID: employee.EMPLOYEE_ID}, {relations:['contactInfo']})
            // updatedone.JOB_ID = data.JOB_ID
            // updatedone.contactInfo[0].SALARY = data.SALARY
            // console.log(updatedone)
            return employee
        }

        async readById(EMPLOYEE_ID:number){
            if(!EMPLOYEE_ID){
                console.log(EMPLOYEE_ID)
                throw new HttpException('Enter a valid number', HttpStatus.BAD_REQUEST)
            }
            else {
                console.log(EMPLOYEE_ID)
            if(!(await this.employeeRepository.findOne({EMPLOYEE_ID})) ){
                throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
            }
        }
            // return await this.employeeRepository.createQueryBuilder("employee")
            // .leftJoinAndSelect("employee.contactInfo","contactInfo")
            // .leftJoinAndSelect("employee.managerType","managerType")
            // .getMany()       
            return await this.employeeRepository.findOne(
                 {EMPLOYEE_ID}
            , {relations:['contactInfo', 'department']})
        }

        async update(EMPLOYEE_ID:number,data:any){
            console.log(data)
            if(!(await this.employeeRepository.findOne({EMPLOYEE_ID})) ){
                throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
            }
            const contactInfoData : ContactInfo = data.contactInfo
            delete data.contactInfo
            // console.log(data)
            const employee = await this.employeeRepository.findOne({EMPLOYEE_ID})
            
            const hashedPassword = await employee.hashpw(data.password)
            console.log(hashedPassword)
            data.password = hashedPassword
            // console.log('****** Before  '+contactInfoData.HIRE_DATE);
            const x :Date = new Date(contactInfoData.HIRE_DATE)
            // console.log('****** AFTER  '+x);
            contactInfoData.HIRE_DATE = x
            await this.employeeRepository.update({EMPLOYEE_ID},data)
            contactInfoData.employee = employee


            await this.contactInfoRepo.update({employee},contactInfoData)
            return await this.employeeRepository.findOne(
                {EMPLOYEE_ID}
           , {relations:['contactInfo']}) 
        }

        async delete(EMPLOYEE_ID:number){
            if(!(await this.employeeRepository.findOne({EMPLOYEE_ID})) ){
                throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
            }
            await this.employeeRepository.update({EMPLOYEE_ID},{isDeleted:1})
            return { suspended: true }
        }

        async updateEmployeeImageById(userId:number,fileName){
            const employee = await this.employeeRepository.findOne({EMPLOYEE_ID:userId},{relations:['contactInfo']})
            employee.contactInfo[0].PICTURE = fileName
            await this.contactInfoRepo.update({ID:employee.contactInfo[0].ID},employee.contactInfo[0])
            return await this.employeeRepository.findOne({EMPLOYEE_ID:userId},{relations:['contactInfo']})
        }

        async getImagebyEmployeeId(userId){
            const user = await this.employeeRepository.findOne({EMPLOYEE_ID:userId},{relations:['contactInfo']})
            return user.contactInfo[0].PICTURE
        
        }


        async updateEmployeeRole(userId,data){
            const employee = await this.employeeRepository.findOne({EMPLOYEE_ID:userId})
            employee.role = data.role
            await this.employeeRepository.save(employee)
            return employee
        }

 
}




    // async seed(){
    //     const ceo = this.employeeRepository.create({name:'Gamal'})
    //     await this.employeeRepository.save(ceo)
    //     const ceo2 = this.employeeRepository.create({name:'Shawer'})
    //     await this.employeeRepository.save(ceo2)

    //     const ceoContactInfo = this.contactInfoRepo.create({email:'email@email.com'})
    //     ceoContactInfo.employee = ceo
    //     await this.contactInfoRepo.save(ceoContactInfo)

    //     const manager = this.employeeRepository.create({name:'manager'})
    //     manager.directReports = [ceo,ceo2]

    //     const task1 = this.taskRepo.create({name:'Hire People'})
    //     await this.taskRepo.save(task1)
    //     const task2 = this.taskRepo.create({name:'Present to CEO'})
    //     await this.taskRepo.save(task2)

    //     manager.tasks = [task1,task2]

    //     const meeting1 = this.meetingRepo.create({zoomUrl:'meeting.com'})
    //     meeting1.attendees = [ceo]
    //     await this.meetingRepo.save(meeting1)

    //     manager.meetings = [meeting1]

    //     this.employeeRepository.save(manager)

    // }