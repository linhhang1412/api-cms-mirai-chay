-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'MANAGER', 'STAFF');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "publicId" UUID NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "fullName" VARCHAR(100),
    "phone" VARCHAR(20),
    "role" "public"."Role" NOT NULL DEFAULT 'STAFF',
    "avatar" VARCHAR(255),
    "status" "public"."Status" NOT NULL DEFAULT 'ACTIVE',
    "lastLoginAt" TIMESTAMP(3),
    "lastOtpSentAt" TIMESTAMP(3),
    "failedLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."email_otps" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "email_otps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_publicId_key" ON "public"."users"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "uniq_user_email" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "idx_user_status" ON "public"."users"("status");

-- CreateIndex
CREATE INDEX "idx_user_role" ON "public"."users"("role");

-- CreateIndex
CREATE INDEX "idx_user_status_role" ON "public"."users"("status", "role");

-- CreateIndex
CREATE INDEX "idx_user_email_status" ON "public"."users"("email", "status");

-- CreateIndex
CREATE INDEX "idx_user_last_login" ON "public"."users"("lastLoginAt");

-- CreateIndex
CREATE INDEX "idx_user_last_otp_sent" ON "public"."users"("lastOtpSentAt");

-- CreateIndex
CREATE INDEX "idx_otp_email" ON "public"."email_otps"("email");

-- CreateIndex
CREATE INDEX "idx_otp_expires" ON "public"."email_otps"("expiresAt");

-- CreateIndex
CREATE INDEX "idx_otp_created" ON "public"."email_otps"("createdAt");

-- CreateIndex
CREATE INDEX "idx_otp_active" ON "public"."email_otps"("email", "expiresAt", "used");

-- CreateIndex
CREATE UNIQUE INDEX "email_otps_email_code_used_key" ON "public"."email_otps"("email", "code", "used");

-- AddForeignKey
ALTER TABLE "public"."email_otps" ADD CONSTRAINT "email_otps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
