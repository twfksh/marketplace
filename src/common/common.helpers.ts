import * as bcrypt from 'bcryptjs';

export async function hashBcrypt(str: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(str, salt);
}

export async function verifyBcrypt(str: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(str, hash);
}