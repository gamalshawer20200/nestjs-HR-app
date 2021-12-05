import { PartialType } from "@nestjs/mapped-types";

export class CreateEmployee {

    username: string
    
    password: string

    JOB_ID?: string


}