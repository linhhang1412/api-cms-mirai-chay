import { EmailOtp } from "generated/prisma";

export class EmailOtpEntity implements EmailOtp {
    id: number;
    email: string;
    code: string;
    expiresAt: Date;
    attempts: number;
    used: boolean;
    createdAt: Date;
    userId: number | null;

    constructor(partial: Partial<EmailOtpEntity>) {
        Object.assign(this, partial);
    }
}
