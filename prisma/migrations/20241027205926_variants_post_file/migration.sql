/*
  Warnings:

  - You are about to drop the column `banner` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `banner` on the `Variant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "banner",
ADD COLUMN     "bannerId" TEXT;

-- AlterTable
ALTER TABLE "Variant" DROP COLUMN "banner",
ADD COLUMN     "bannerId" TEXT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
