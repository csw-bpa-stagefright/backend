export interface VerifyJwtReturnObject {
    isValid?: boolean;
    statusCode: 0 | 1;
    payload?:any;
}