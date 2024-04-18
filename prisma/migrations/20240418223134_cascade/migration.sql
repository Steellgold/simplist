-- DropForeignKey
ALTER TABLE "Meta" DROP CONSTRAINT "Meta_postId_fkey";

-- AddForeignKey
ALTER TABLE "Meta" ADD CONSTRAINT "Meta_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
