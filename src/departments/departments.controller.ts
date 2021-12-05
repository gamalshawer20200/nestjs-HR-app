import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, HttpException, HttpStatus } from '@nestjs/common';
import { User } from 'src/employees/user.decorator';
import { AuthGuard } from 'src/shared/auth.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Role } from 'src/shared/role.enum';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { DepartmentEntity } from './entities/department.entity';
// import { UpdateDepartmentDto } from './dto/update-department.dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Roles(Role.ADMIN,Role.HR)
  @Post('create')
  @UseGuards(new AuthGuard(),RolesGuard)
  async create(@User() user , @Body() createDepartmentDto: CreateDepartmentDto) {
    // console.log(user.username ,  createDepartmentDto)
    return this.departmentsService.create(createDepartmentDto);
  }

  @Roles(Role.ADMIN,Role.HR)
  @UseGuards(new AuthGuard(),RolesGuard)
  @Post('updateUserDepratment')
  updateUserDepratment(@Body()data:any){
    console.log(data)
    this.departmentsService.updateUserDepratment(data)
  }

  @Roles(Role.ADMIN,Role.HR, Role.MANAGER,Role.LEADER,Role.OFFICER)
  @UseGuards(new AuthGuard(),RolesGuard)
  @Get()
  async findAll(): Promise<any> {
    return await this.departmentsService.findAll();
  }

  @Roles(Role.ADMIN,Role.HR)
  @UseGuards(new AuthGuard(),RolesGuard)
  @Put(':id')
  async update(@Param('id') id:any, @Body() data:any){    
    await this.departmentsService.update(id,data)
  }

  @Roles(Role.ADMIN,Role.HR)
  @Post('delete')
  @UseGuards(new AuthGuard(),RolesGuard)
  remove(@Body() data:DepartmentEntity, @User() user){
    if(data.DEPARTMENT_ID == 9){
      throw new HttpException('This department can not be deleted !', HttpStatus.FORBIDDEN)
    }
    return this.departmentsService.remove(data)
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
  //   return this.departmentsService.update(+id, updateDepartmentDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.departmentsService.remove(+id);
  // }
}
