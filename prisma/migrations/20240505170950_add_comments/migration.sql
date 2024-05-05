-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "projectId" TEXT;

-- AlterTable
ALTER TABLE "Meta" ADD COLUMN     "commentId" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "commentsEnabled" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meta" ADD CONSTRAINT "Meta_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
