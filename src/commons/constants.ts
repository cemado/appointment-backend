export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const STAGE = process.env.STAGE || 'dev';
export const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
export const AWS_PROFILE = process.env.AWS_PROFILE || 'default';
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
export const DEBUG_MODE = process.env.DEBUG_MODE === 'true';
export const APP_NAME = process.env.APP_NAME || 'appointment-backend';
export const APP_VERSION = process.env.APP_VERSION || '1.0.0';
export const TIMEOUT_SECONDS = Number(process.env.TIMEOUT_SECONDS) || 30;
export const LOCAL_PORT = Number(process.env.LOCAL_PORT) || 3000;
export const LOCAL_HOST = process.env.LOCAL_HOST || 'localhost';
export const DYNAMODB_TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'appointments-table';
// Agrega aquí otras variables de entorno que uses en el proyecto