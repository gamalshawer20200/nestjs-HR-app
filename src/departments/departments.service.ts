import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from 'src/employees/employee.entity';
import { Repository } from 'typeorm';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentEntity } from './entities/department.entity';

@Injectable()
export class DepartmentsService {
  
  constructor(
    @InjectRepository(DepartmentEntity) 
    private departmentRepository:Repository<DepartmentEntity>,
    @InjectRepository(EmployeeEntity) 
    private employeeRepository:Repository<EmployeeEntity>,
  ){
  }
  async create(createDepartmentDto: CreateDepartmentDto) {
    const dept =  this.departmentRepository.create(createDepartmentDto)
    await this.departmentRepository.save(dept)
    return dept
  }

  async findAll() {
    //  return await this.employeeRepository.find({relations:['department']})

    // return await this.departmentRepository.find({relations:['employee'],where:{}})


    const AllDepartmentsHavingEmployees =  await this.departmentRepository.createQueryBuilder("DEPARTMENTS")
    .leftJoinAndSelect("DEPARTMENTS.employee","employee")
    // .leftJoinAndSelect("")
    .where("employee.isDeleted = :id", {id: 0})
    .getMany()     // we will not returning tha departments that have no employees *IDK why :D !!*

    const AllDepartments = await this.departmentRepository.find({relations:['employee']})
      
    AllDepartments.filter(item=> {
      if(item.employee.length < 1 ) {  // getting AllDepartmentsNotHavingEmployees
        AllDepartmentsHavingEmployees.push(item)  //push Departments that have no employees to the departments that having employees 
      }
    })

    return AllDepartmentsHavingEmployees
    
  }

  async updateUserDepratment(data:any){
    // let employeeId = parseInt(data.employeeId)
    // let departmentId = parseInt(data.departmentId)
    let employee = await this.employeeRepository.findOne({EMPLOYEE_ID:data.employeeId})
    let department = await this.departmentRepository.findOne({DEPARTMENT_ID: parseInt(data.departmentId)})
    console.log('------------------');
    console.log(employee)
    // console.log(department)


    employee.department = department
    this.employeeRepository.save(employee)
   console.log(( await this.employeeRepository.findOne({EMPLOYEE_ID:employee.EMPLOYEE_ID},{relations:['department']})))
    

  }

  findOne(id: number) {
    return `This action returns a #${id} department`;
  }

  async update(DEPARTMENT_ID: number, data: UpdateDepartmentDto) {
    console.log(DEPARTMENT_ID)
    console.log(data)
    
    await this.departmentRepository.update(DEPARTMENT_ID,data)
    return await this.departmentRepository.findOne({DEPARTMENT_ID}, {relations:['employee']})
  }

  async remove(data: DepartmentEntity) {
    console.log('dataaaaaa',data)
    const dept = await this.departmentRepository.findOne({DEPARTMENT_ID: 9}, {relations:['employee']})
    const tobeDeletedDept = await this.departmentRepository.findOne({DEPARTMENT_ID: data.DEPARTMENT_ID})
    try{data.employee.map(employee=>{
      dept.employee.push(employee)
    })
  }catch(err){
    console.log(err)
  }
    await this.departmentRepository.save(dept)
    await this.departmentRepository.delete(tobeDeletedDept)
    return 'Done!'
    // dept.employee.push()
  }
}
