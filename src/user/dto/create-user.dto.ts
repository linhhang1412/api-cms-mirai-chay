import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role, Status } from 'generated/prisma';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    fullName?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsEnum(Role)
    @IsOptional()
    role?: Role = Role.STAFF;

    @IsEnum(Status)
    @IsOptional()
    status?: Status = Status.ACTIVE;
}
