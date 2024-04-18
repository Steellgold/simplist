-- CreateEnum
CREATE TYPE "MetaType" AS ENUM ('STRING', 'NUMBER', 'BOOLEAN');

-- AlterTable
ALTER TABLE "Meta" ADD COLUMN     "type" "MetaType" NOT NULL DEFAULT 'STRING';
