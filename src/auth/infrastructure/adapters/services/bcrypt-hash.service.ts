import { IHashService } from "../../ports/hash-service.interface";
import * as bcrypt from 'bcryptjs';

export class BcryptHashService implements IHashService {
  async hash(text: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(text, 10, function (err, hash) {
        if (err) {
          reject(err);
        } else {
          resolve(hash as string);
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
          resolve(result as boolean);
        }
      });
    });
  }
}