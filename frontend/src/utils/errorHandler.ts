import { AxiosError } from 'axios';

export interface ApiError {
  success: false;
  error: string;
  details?: any[];
}

export interface ApiResponse<T = any> {
  success: true;
  data: T;
}

export type ApiResult<T = any> = ApiResponse<T> | ApiError;

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleApiError = (error: AxiosError): AppError => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    const message = (data as ApiError)?.error || `HTTP ${status} Error`;
    return new AppError(message, status);
  } else if (error.request) {
    // Request was made but no response received
    return new AppError('Network error - please check your connection', 0);
  } else {
    // Something else happened
    return new AppError(error.message || 'An unexpected error occurred', 500);
  }
};

export const isApiError = (response: any): response is ApiError => {
  return response && response.success === false && typeof response.error === 'string';
};

export const isApiSuccess = <T>(response: any): response is ApiResponse<T> => {
  return response && response.success === true && response.data !== undefined;
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred';
};

export const getErrorStatus = (error: unknown): number => {
  if (error instanceof AppError) {
    return error.statusCode;
  }
  
  if (error instanceof AxiosError && error.response) {
    return error.response.status;
  }
  
  return 500;
};

// Error boundary helper
export const logError = (error: Error, errorInfo?: any) => {
  console.error('Application Error:', {
    message: error.message,
    stack: error.stack,
    errorInfo,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  });

  // In production, you might want to send this to an error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }
};

// Retry helper for failed requests
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Don't retry on certain error types
      if (error instanceof AppError && error.statusCode >= 400 && error.statusCode < 500) {
        throw error;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError!;
};

// Network status helper
export const isOnline = (): boolean => {
  return navigator.onLine;
};

export const waitForOnline = (): Promise<void> => {
  return new Promise((resolve) => {
    if (navigator.onLine) {
      resolve();
      return;
    }

    const handleOnline = () => {
      window.removeEventListener('online', handleOnline);
      resolve();
    };

    window.addEventListener('online', handleOnline);
  });
};
