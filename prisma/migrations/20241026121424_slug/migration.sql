/*
  Warnings:

  - A unique constraint covering the columns `[slug,organizationId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - The required column `slug` was added to the `Post` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "slug" TEXT NOT NULL,
ALTER COLUMN "authorId" SET DEFAULT 'Deleted User';

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_organizationId_key" ON "Post"("slug", "organizationId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "member"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;
