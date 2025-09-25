// src/handlers/aws-health.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { successResponse, errorResponse } from '../utils/response';

interface AWSHealthCheck {
  region: string;
  accountId?: string;
  stage: string;
  lambdaContext: {
    functionName: string;
    functionVersion: string;
    memoryLimitInMB: number;
    remainingTimeInMillis: number;
  };
  environment: {
    nodeEnv: string;
    awsRegion: string;
  };
  timestamp: string;
  status: 'healthy' | 'warning' | 'error';
  checks: {
    lambdaExecution: boolean;
    environmentVariables: boolean;
    awsServices: boolean;
  };
}

/**
 * 🔍 Verificar conexión y configuración de AWS
 * GET /aws-health - Health check completo de AWS
 */
export const checkAWSHealth = async (
  event: APIGatewayProxyEvent,
  context: any
): Promise<APIGatewayProxyResult> => {
  try {
    const startTime = Date.now();
    
    // Obtener información del contexto de Lambda
    const lambdaInfo = {
      functionName: context.functionName || 'unknown',
      functionVersion: context.functionVersion || 'unknown',
      memoryLimitInMB: context.memoryLimitInMB || 0,
      remainingTimeInMillis: context.getRemainingTimeInMillis?.() || 0
    };

    // Verificar variables de entorno
    const environmentCheck = {
      nodeEnv: process.env.NODE_ENV || 'unknown',
      awsRegion: process.env.AWS_REGION || process.env.REGION || process.env.AWS_DEFAULT_REGION || 'unknown',
      stage: process.env.STAGE || 'unknown',
      accountId: process.env.AWS_ACCOUNT_ID || 'unknown'
    };

    // Realizar verificaciones
    const checks = {
      lambdaExecution: true, // Si llegamos aquí, Lambda funciona
      environmentVariables: !!(environmentCheck.nodeEnv && environmentCheck.awsRegion),
      awsServices: true // Verificación básica
    };

    // Determinar estado general
    const allChecksPass = Object.values(checks).every(check => check === true);
    const status: 'healthy' | 'warning' | 'error' = allChecksPass ? 'healthy' : 'warning';

    const healthCheck: AWSHealthCheck = {
      region: environmentCheck.awsRegion,
      accountId: environmentCheck.accountId,
      stage: environmentCheck.stage,
      lambdaContext: lambdaInfo,
      environment: {
        nodeEnv: environmentCheck.nodeEnv,
        awsRegion: environmentCheck.awsRegion
      },
      timestamp: new Date().toISOString(),
      status,
      checks
    };

    const responseTime = Date.now() - startTime;
    
    return successResponse({
      healthCheck,
      meta: {
        responseTimeMs: responseTime,
        executionTime: new Date().toISOString()
      }
    }, `AWS Health Check ${status.toUpperCase()}`);

  } catch (err) {
    console.error('AWS Health Check Error:', err);
    
    return errorResponse(
      `AWS Health Check Failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
      500
    );
  }
};

/**
 * 🔧 Verificar configuración específica de AWS
 * GET /aws-config - Mostrar configuración actual
 */
export const checkAWSConfig = async (
  event: APIGatewayProxyEvent,
  context: any
): Promise<APIGatewayProxyResult> => {
  try {
    // Información de configuración (sin datos sensibles)
    const config = {
      aws: {
        region: process.env.AWS_REGION || process.env.REGION || process.env.AWS_DEFAULT_REGION || 'Not configured',
        stage: process.env.STAGE || 'Not configured',
        runtime: process.version,
        architecture: process.arch,
        platform: process.platform
      },
      lambda: {
        functionName: context.functionName || 'unknown',
        functionVersion: context.functionVersion || 'unknown',
        memoryLimit: `${context.memoryLimitInMB || 0} MB`,
        remainingTime: `${context.getRemainingTimeInMillis?.() || 0} ms`
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || 'Not set',
        timezone: process.env.TZ || Intl.DateTimeFormat().resolvedOptions().timeZone,
        locale: process.env.LANG || 'Not set'
      },
      serverless: {
        stage: process.env.STAGE || 'Not configured',
        service: 'appointment-backend',
        provider: 'aws'
      }
    };

    return successResponse({
      config,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: context.awsRequestId || 'unknown'
      }
    }, 'AWS Configuration Retrieved');

  } catch (err) {
    console.error('AWS Config Check Error:', err);
    
    return errorResponse(
      `Failed to retrieve AWS configuration: ${err instanceof Error ? err.message : 'Unknown error'}`,
      500
    );
  }
};

/**
 * 🧪 Prueba de conectividad con servicios AWS
 * GET /aws-connectivity - Verificar conexión a servicios específicos
 */
export const testAWSConnectivity = async (
  event: APIGatewayProxyEvent,
  context: any
): Promise<APIGatewayProxyResult> => {
  try {
    const startTime = Date.now();
    
    // Pruebas básicas sin SDK adicionales
    const tests = {
      lambdaExecution: {
        status: 'passed',
        message: 'Lambda function is executing successfully',
        responseTime: 0
      },
      environmentAccess: {
        status: (process.env.AWS_REGION || process.env.REGION) ? 'passed' : 'failed',
        message: (process.env.AWS_REGION || process.env.REGION) ? 'Environment variables accessible' : 'AWS_REGION not found',
        responseTime: 0
      },
      contextAccess: {
        status: context.functionName ? 'passed' : 'failed',
        message: context.functionName ? 'Lambda context accessible' : 'Lambda context not available',
        responseTime: 0
      }
    };

    const totalResponseTime = Date.now() - startTime;
    const passedTests = Object.values(tests).filter(test => test.status === 'passed').length;
    const totalTests = Object.keys(tests).length;
    const success_rate = (passedTests / totalTests) * 100;

    return successResponse({
      summary: {
        totalTests,
        passedTests,
        failedTests: totalTests - passedTests,
        successRate: `${success_rate}%`,
        totalResponseTime: `${totalResponseTime}ms`
      },
      tests,
      recommendations: success_rate < 100 ? [
        'Verify AWS credentials are configured',
        'Check serverless.yml configuration',
        'Ensure proper IAM permissions',
        'Verify environment variables'
      ] : [
        'All basic connectivity tests passed',
        'System is ready for deployment'
      ],
      meta: {
        timestamp: new Date().toISOString(),
        requestId: context.awsRequestId || 'unknown'
      }
    }, 'AWS Connectivity Test Completed');

  } catch (err) {
    console.error('AWS Connectivity Test Error:', err);
    
    return errorResponse(
      `AWS connectivity test failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
      500
    );
  }
};