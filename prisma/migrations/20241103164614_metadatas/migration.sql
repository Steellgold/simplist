-- CreateEnum
CREATE TYPE "MetaType" AS ENUM ('string', 'number', 'boolean', 'date', 'time', 'datetime');

-- CreateTable
CREATE TABLE "Meta" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" "MetaType" NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meta_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Meta" ADD CONSTRAINT "Meta_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
