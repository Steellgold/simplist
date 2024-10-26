/*
  Warnings:

  - You are about to drop the column `exerpt` on the `Post` table. All the data in the column will be lost.
  - Added the required column `excerpt` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Lang" AS ENUM ('EN', 'ZH', 'HI', 'ES', 'BN', 'RU', 'PT', 'FR', 'UR', 'JP', 'AR', 'KO', 'VI', 'TH', 'GU', 'TR', 'FA', 'DE', 'IT', 'LN');

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "exerpt",
ADD COLUMN     "excerpt" TEXT NOT NULL,
ADD COLUMN     "lang" "Lang" NOT NULL DEFAULT 'EN';

-- CreateTable
CREATE TABLE "Variant" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "lang" "Lang" NOT NULL,
    "authorId" TEXT NOT NULL DEFAULT 'Deleted User',
    "postId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "member"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
