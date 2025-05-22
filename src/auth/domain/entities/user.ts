import { AuthMethod } from "../objects/auth-method";

export class User {
  id: number;
  email: string; 
  name: string;
  surname: string;
  profilePicture?: string; // Optional field
  authMethods: AuthMethod[]; // Assuming this is an array of auth methods
} 