import { Role, Status, User as PrismaUser } from 'generated/prisma';

export class UserEntity implements PrismaUser {
    id: number;
    publicId: string;
    email: string;
    fullName: string | null;
    phone: string | null;
    role: Role;
    avatar: string | null;
    status: Status;
    lastLoginAt: Date | null;
    lastOtpSentAt: Date | null;
    failedLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;

    // 👇 Liên kết với EmailOtp
    emailOtps: any[]; // bạn có thể map sang EmailOtpEntity nếu muốn tách rõ

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}
