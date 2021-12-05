import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Post, Put, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { EmployeesService } from './employees.service';
import { LoginDTO } from './login.dto';
import {diskStorage} from 'multer'
import {v4 as uuidv4} from 'uuid'
import { saveImageToStorage } from './image-storage';
import path = require('path')
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from './user.decorator';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/role.enum';
import { RolesGuard } from 'src/shared/guards/roles.guard';

@Controller('employees')
export class EmployeesController {
    constructor(private employeeService:EmployeesService){}

    private logger = new Logger('EmployeeController')


    @Roles(Role.ADMIN,Role.HR, Role.MANAGER,Role.LEADER,Role.OFFICER)
    @Get()
    @UseGuards(new AuthGuard(),RolesGuard)
    async findall(@User() user) : Promise<any>{
        console.log(user)
        return await this.employeeService.findall(user)
    }

    @Roles(Role.ADMIN,Role.HR)
    @Get('suspend')
    @UseGuards(new AuthGuard(),RolesGuard)
    async findallDeletedEmployees() : Promise<any>{
        return await this.employeeService.findallDeletedEmployees()
    }

    //-----------------------------------------------------------

    // @Get('protected')
    // async seed() : Promise<any> {
    //     // await this.employeeService.generateUser()
    //     return 'Done!'
    // }

    
    @Post('login')
    @UsePipes(new ValidationPipe)
    async login(@Body() data: LoginDTO):Promise<any>{
        this.logger.log(JSON.stringify(data))
        return await this.employeeService.login(data)
    }
    
    // @Post('register')
    // async register(@Body() data: LoginDTO):Promise<any>{
    //     return this.employeeService.register(data)
    // }
    

    @Roles(Role.ADMIN,Role.HR)
    @Post('create')
    @UseGuards(new AuthGuard(),RolesGuard)
    createEmployee(@Body() data: any){
        this.logger.log(JSON.stringify(data))
        return this.employeeService.create(data)
    }

    @Get(':EMPLOYEE_ID')
    getEmployeeById(@Param('EMPLOYEE_ID') EMPLOYEE_ID:string){
        return this.employeeService.readById(parseInt(EMPLOYEE_ID))
    }

    @Roles(Role.ADMIN,Role.HR,Role.LEADER,Role.MANAGER,Role.OFFICER)
    @Put(':EMPLOYEE_ID')
    @UseGuards(new AuthGuard(),RolesGuard)
    updateEmployee(@User() user,@Body() data:any , @Param('EMPLOYEE_ID') EMPLOYEE_ID:string){
        this.logger.log(JSON.stringify(data))

        if(user.role !== 'admin'){
            if(user.role !== 'hr'){
                if( user.EMPLOYEE_ID != parseInt(EMPLOYEE_ID) ){
                throw new HttpException('unAuthorized : you are not allowed to do that Action !',HttpStatus.UNAUTHORIZED)
                } 
            }
        }
        return this.employeeService.update(parseInt(EMPLOYEE_ID),data)
    }

    @Roles(Role.ADMIN)
    @Delete(':EMPLOYEE_ID')
    @UseGuards(new AuthGuard(),RolesGuard)
    deleteEmployee(@Param('EMPLOYEE_ID') EMPLOYEE_ID:string){
        return this.employeeService.delete(parseInt(EMPLOYEE_ID))
    }

    @Post('/uploadImage/:id')
    @UseGuards(new AuthGuard())
    @UseInterceptors(FileInterceptor('image', saveImageToStorage))
    uploadFile(@User() user ,@UploadedFile() file:  Express.Multer.File, @Param('id') userId){
       if(!user || !userId){
        throw new HttpException('Not Found',HttpStatus.NOT_FOUND)
       }

        if(user.role !== 'admin'){
            if(user.role !== 'hr'){
                if( user.EMPLOYEE_ID != parseInt(userId) ){
                throw new HttpException('unAuthorized : you are not allowed to do that Action !',HttpStatus.UNAUTHORIZED)
                } 
            }
        }
        // console.log(file)
        const fileName = file?.filename
        // console.log(file.path)
        if(!fileName) return {error: 'File Must be a png, jpg or jpeg'}
        return this.employeeService.updateEmployeeImageById(userId,fileName)
    }

    @Get('/image/:id')
     async getImagebyEmployeeId(@Param('id') userId){
        const fileName = await this.employeeService.getImagebyEmployeeId(userId)
        // res.sendFile(fileName,{root:'./uploads/profileImages/'})
        
        console.log(path.join(process.cwd(), '/uploads/profileImages/'+fileName))
        return  {fileName}
        
    }

    @Roles(Role.ADMIN)
    @UseGuards(new AuthGuard(),RolesGuard)
    @Post('updateRole/:id')
    async updateRole(@Param('id') userId, @Body() data:any){
        this.logger.log(data)
        await this.employeeService.updateEmployeeRole(userId,data)
    }
}
