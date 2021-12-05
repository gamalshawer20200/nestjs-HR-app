import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { EmployeesService } from 'src/employees/employees.service';
import { Roles, ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  
  
  constructor(private reflector: Reflector,){}
  
  canActivate(
    context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY,[
          context.getHandler(),
          context.getClass()
        ])

        if(!requiredRoles){
          return true
        } 

        const {user} = context.switchToHttp().getRequest()
        console.log('Roleeeeee'+JSON.stringify(user));

        if( requiredRoles.some(role => user.role?.includes(role)) ){
          return true
        } else {
          throw new HttpException('You are not Allowed to do that !', HttpStatus.UNAUTHORIZED)
          // return false
        }
  }
}
