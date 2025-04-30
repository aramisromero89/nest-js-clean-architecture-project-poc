import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories/user-repository.interface';
import { User } from '../../../domain/entities/user';

@Injectable()
export class InMemoryUserRepository implements IUserRepository {

  private users: User[] = [];

  async findById(id: number): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async save(user: User): Promise<User> {
    const maxId = Math.max(0, ...this.users.map(user => user.id));
    user.id = maxId + 1;
    this.users.push(user);
    return user;
  }

  async findByAuthMethodData(authMethod: string, parameter: string, value: any): Promise<User | null> {
    //find user by authMethodData
    let res = this.users.find(user => user[authMethod][parameter] === value) || null;
    return res;
  }
} 