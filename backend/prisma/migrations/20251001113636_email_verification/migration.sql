-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."verificationToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "verificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "verificationToken_token_key" ON "public"."verificationToken"("token");

-- AddForeignKey
ALTER TABLE "public"."verificationToken" ADD CONSTRAINT "verificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
