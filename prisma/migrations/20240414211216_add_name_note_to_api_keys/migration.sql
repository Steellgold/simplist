/*
  Warnings:

  - Added the required column `name` to the `APIKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "APIKey" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "note" TEXT;
