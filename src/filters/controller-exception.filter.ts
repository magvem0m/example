import { Catch, RpcExceptionFilter, ArgumentsHost, HttpException, ExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class ExceptionFilterMs implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    return new Observable((subscriber) => {
      subscriber.next(new HttpException(exception.message, 503));
      subscriber.complete();
    });
  }
}
