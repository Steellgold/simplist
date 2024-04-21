/*
  Warnings:

  - The values [STRING,NUMBER,BOOLEAN] on the enum `MetaType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MetaType_new" AS ENUM ('string', 'number', 'boolean');
ALTER TABLE "Meta" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Meta" ALTER COLUMN "type" TYPE "MetaType_new" USING ("type"::text::"MetaType_new");
ALTER TYPE "MetaType" RENAME TO "MetaType_old";
ALTER TYPE "MetaType_new" RENAME TO "MetaType";
DROP TYPE "MetaType_old";
ALTER TABLE "Meta" ALTER COLUMN "type" SET DEFAULT 'string';
COMMIT;

-- AlterTable
ALTER TABLE "Meta" ALTER COLUMN "type" SET DEFAULT 'string';
