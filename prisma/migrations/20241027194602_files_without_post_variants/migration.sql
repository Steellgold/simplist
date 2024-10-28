/*
  Warnings:

  - You are about to drop the column `authorId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `isBanner` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `Post` table. All the data in the column will be lost.
  - Added the required column `memberId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_authorId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_postId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_variantId_fkey";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "authorId",
DROP COLUMN "isBanner",
DROP COLUMN "mimeType",
DROP COLUMN "postId",
DROP COLUMN "variantId",
ADD COLUMN     "memberId" TEXT NOT NULL,
ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "publishedAt",
ADD COLUMN     "banner" TEXT,
ADD COLUMN     "scheduledAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Variant" ADD COLUMN     "banner" TEXT;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
