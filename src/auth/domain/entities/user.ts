import { AuthMethod } from "./auth-method";

export class User {
  id: number;
  email: string; 
  name: string;
  surname: string;
  authMethods: AuthMethod[]; // Assuming this is an array of auth methods
} 