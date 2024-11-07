/*
  Warnings:

  - You are about to drop the `Key` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Key" DROP CONSTRAINT "Key_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Key" DROP CONSTRAINT "Key_organizationId_fkey";

-- DropTable
DROP TABLE "Key";
