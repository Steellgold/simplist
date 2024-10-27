-- AlterTable
ALTER TABLE "File" ADD COLUMN     "variantId" TEXT;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
