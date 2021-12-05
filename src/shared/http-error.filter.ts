import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";

@Catch()
export class HttpErrorFilter implements ExceptionFilter{

    catch(exception: HttpException, host:ArgumentsHost){
        const ctx = host.switchToHttp()
        const request = ctx.getRequest()
        const response = ctx.getResponse()
        let statusx = 404
        
        
        const errorResponse = {
            code : null,
            timeStamp: new Date().toLocaleDateString(),
            path: request.url,
            method: request.method,
            message: exception.message || null,
        }
        if(exception instanceof HttpException){
        statusx = exception.getStatus()
        errorResponse.code = statusx
        }

        Logger.error(`${request.method} ${request.url}`,JSON.stringify(errorResponse), 'ExceptionFilter')

        response.status(statusx).json(errorResponse)
    }
}