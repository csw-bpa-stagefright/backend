export interface UserExistReturnObject {
    userExists ?: boolean;
    userData ?: {
      email: string;
      name: string;
      hashedPassword: string;
    }
    statusCode: 0 | 1;
}