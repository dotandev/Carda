// import bcrypt from "bcrypt";
// import crypto from "crypto";


// export class Hasher {
//     private saltRounds: number;
    
//     constructor(saltRounds: number = 10) {
//         this.saltRounds = saltRounds;
//     }
    
//     public async hashPassword(password: string): Promise<string> {
//         const salt = await bcrypt.genSalt(this.saltRounds);
//         return bcrypt.hash(password, salt);
//     }
    
//     public async comparePassword(password: string, hash: string): Promise<boolean> {
//         return bcrypt.compare(password, hash);
//     }
    
//     public generateToken(length: number = 32): string {
//         return crypto.randomBytes(length).toString("hex");
//     }
// }


import crypto from "crypto";

export class Hasher {
  private secret: string;
  private algorithm: string;
  private ivLength: number;

  constructor(secret: string, algorithm = "aes-256-cbc") {
    if (secret.length < 32) throw new Error("Secret must be at least 32 characters.");
    this.secret = secret.slice(0, 32); 
    this.algorithm = algorithm;
    this.ivLength = 16;
  }

  public hashPassword(password: string): string {
    console.log("about to hash");
    const hmac = crypto.createHmac("sha512", this.secret);
    // hmac.update(password);
    return hmac.digest("hex");
  }

  public verifyPassword(password: string, hashed: string): boolean {
    const hashToCompare = this.hashPassword(password);
    const isSafe = crypto.timingSafeEqual(Buffer.from(hashed), Buffer.from(hashToCompare));
    return isSafe;
  }

  public encrypt(text: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.secret), iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
  }

  public decrypt(encryptedText: string): string {
    const [ivHex, encrypted] = encryptedText.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.secret), iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  public generateToken(length = 32): string {
    return crypto.randomBytes(length).toString("hex");
  }
}
