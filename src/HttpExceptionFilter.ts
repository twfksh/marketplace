import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

export interface HttpExceptionResponse {
  statusCode: number;
  message: string;
  error: string;
}

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const context = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    console.log('Exception ==> ', exception);

    const exceptionResponse =
      exception instanceof HttpException
        ? context.getResponse()
        : String(exception);

    const responseBody = {
      statusCode: httpStatus,
      timeStanp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(context.getResponse()),
      message:
        (exceptionResponse as HttpExceptionResponse).message ||
        (exceptionResponse as HttpExceptionResponse).error ||
        exceptionResponse ||
        'Something went wrong!',
      errorResponse: exceptionResponse as HttpExceptionResponse,
    };

    httpAdapter.reply(context.getResponse(), responseBody, httpStatus);
  }
}
