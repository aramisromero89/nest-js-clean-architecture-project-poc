import { User } from '../entities/user';

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(username: string): Promise<User | null>;
  findByAuthMethodData(authMethod: string, parameter:string,value:any): Promise<User | null>;
  save(user: User): Promise<User>;
} 