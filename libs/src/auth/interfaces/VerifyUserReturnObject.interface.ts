export interface VerifyUserReturnObject {
    userVerified?: boolean;
    errorInfo?: string;
    statusCode: 0 | 1;
    errorCode?: number;
    userData?: any;
  }