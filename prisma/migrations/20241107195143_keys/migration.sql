-- AlterTable
ALTER TABLE "user" ADD COLUMN     "defaultOrgId" TEXT;

-- CreateTable
CREATE TABLE "Key" (
    "key" TEXT NOT NULL,
    "lastUsedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Key_pkey" PRIMARY KEY ("key")
);

-- AddForeignKey
ALTER TABLE "Key" ADD CONSTRAINT "Key_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Key" ADD CONSTRAINT "Key_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
