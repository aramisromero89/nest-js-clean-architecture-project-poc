import { IHashService } from "../../ports/hash-service.interface";
import * as bcrypt from 'bcrypt';

export class BcryptHashService implements IHashService {
  async hash(text: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(text, 10, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  }

  async compare(text: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(text, hash, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}