import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories/user-repository.interface';
import { User } from '../../../domain/entities/user';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JsonFileUserRepository implements IUserRepository {
  private readonly filePath = path.join(
    process.cwd(),
    process.env.GENERATED_FILES_DIR ?? '',
    process.env.USERS_JSON_REPO_FILE ?? ''
  );

  private readUsersFromFile(): User[] {
    if (!fs.existsSync(this.filePath)) {
      return [];
    }
    const data = fs.readFileSync(this.filePath, 'utf8');    
    const users = JSON.parse(data);
    return users.map((user: any) => ({ ...user, id: parseInt(user.id, 10) }));
  }

  private writeUsersToFile(users: User[]): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(this.filePath, JSON.stringify(users, null, 2));
  }

  async findById(id: number): Promise<User | null> {
    const users = this.readUsersFromFile();
    return users.find(user => user.id === id) || null;
  }

  async findByEmail(username: string): Promise<User | null> {
    const users = this.readUsersFromFile();
    return users.find(user => user.email === username) || null;
  }

  async save(user: User): Promise<User> {
    const users = this.readUsersFromFile();
    const maxId = Math.max(0, ...users.map(user => user.id));
    user.id = maxId + 1;
    users.push(user);
    this.writeUsersToFile(users);
    return user;
  }

  async findByAuthMethodData(authMethod: string, parameter: string, value: any): Promise<User | null> {
    const users = this.readUsersFromFile();
    const res = users.find(user => 
      user.authMethods.some(method => method.type === authMethod && method.data[parameter] === value)
    ) || null;
    return res;
  }
}