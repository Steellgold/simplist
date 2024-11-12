-- AlterTable
ALTER TABLE "Integration" ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "credentials" SET DEFAULT '{}';
