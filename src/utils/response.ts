import { APIGatewayProxyResult } from 'aws-lambda';

export interface ApiResponse {
  statusCode: number;
  data?: any;
  error?: string;
  errors?: string[];
  message?: string;
}

export const createResponse = (
  statusCode: number, 
  body: any, 
  additionalHeaders: Record<string, string> = {}
): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    ...additionalHeaders,
  },
  body: JSON.stringify(body),
});

export const successResponse = (data: any, message?: string, statusCode: number = 200): APIGatewayProxyResult => {
  return createResponse(statusCode, {
    success: true,
    message: message || 'Operación exitosa',
    data
  });
};

export const errorResponse = (error: string, statusCode: number = 500, errors?: string[]): APIGatewayProxyResult => {
  return createResponse(statusCode, {
    success: false,
    error,
    ...(errors && { errors })
  });
};

export const validationErrorResponse = (errors: string[]): APIGatewayProxyResult => {
  return createResponse(400, {
    success: false,
    error: 'Error de validación',
    errors
  });
};