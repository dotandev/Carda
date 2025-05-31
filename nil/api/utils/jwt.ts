import jwt from 'jsonwebtoken';
import { config } from '../config';
import { JWTPayload } from '../types';
import { sign, SignOptions } from 'jsonwebtoken';

export class JWTController {
  private accessSecret: string;
  private refreshSecret: string;
  private refreshExpiresIn: number;
  private accessExpiresIn: number;


  constructor(
    accessSecret?: string,
    refreshSecret?: string,
    accessExpiresIn?: number,
    refreshExpiresIn?: number,
  ) {
    this.accessSecret = accessSecret ?? config.auth.secret as string;
    this.refreshSecret = refreshSecret ?? config.auth.secret as string;
    this.accessExpiresIn = accessExpiresIn ?? 72 * 60 * 60;
    this.refreshExpiresIn = refreshExpiresIn ?? 7 * 24 * 60 * 60;

  }

  public signAccessToken(payload: JWTPayload): string {
    const options: SignOptions = { expiresIn: this.accessExpiresIn };
    const token = jwt.sign(payload, 'secret', options);
    return token;
  }

  public signRefreshToken(payload: JWTPayload): string {
    const options: SignOptions = { expiresIn: this.refreshExpiresIn };
    return jwt.sign(payload, this.refreshSecret, options);
  }

  public verifyAccessToken(token: string): JWTPayload | null {
    try {
      console.log(token);
      return jwt.verify(token, 'secret') as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  public verifyRefreshToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, this.refreshSecret) as JWTPayload;
    } catch (error) {
      return null;
    }
  }
}