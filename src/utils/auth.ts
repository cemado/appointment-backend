import { APIGatewayProxyEvent } from 'aws-lambda';

export const extractUserFromToken = (event: APIGatewayProxyEvent): string | null => {
  try {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    // En un entorno real, aquí validarías el JWT token
    // Por ahora, retornamos un usuario simulado
    return 'user-123';
  } catch (error) {
    console.error('Error extracting user from token:', error);
    return null;
  }
};

export const isAuthorized = (event: APIGatewayProxyEvent): boolean => {
  const user = extractUserFromToken(event);
  return user !== null;
};

export const getClientIp = (event: APIGatewayProxyEvent): string => {
  return event.requestContext?.identity?.sourceIp || 
         event.headers['x-forwarded-for']?.split(',')[0] || 
         'unknown';
};

export const getRateLimitKey = (event: APIGatewayProxyEvent): string => {
  const ip = getClientIp(event);
  const user = extractUserFromToken(event);
  return user ? `user:${user}` : `ip:${ip}`;
};

// Utilidad para logging
export const logRequest = (event: APIGatewayProxyEvent, context: any) => {
  console.log({
    requestId: context.awsRequestId,
    method: event.httpMethod,
    path: event.path,
    ip: getClientIp(event),
    userAgent: event.headers['user-agent'] || event.headers['User-Agent'],
    timestamp: new Date().toISOString()
  });
};