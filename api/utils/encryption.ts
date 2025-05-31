import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const secretKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

export function encrypt(text: string): { iv: string; content: string } {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  };
}

export function decrypt(encrypted: { iv: string; content: string }): string {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(encrypted.iv, 'hex'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted.content, 'hex')),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}
