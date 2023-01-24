/*
  Warnings:

  - A unique constraint covering the columns `[userId,tweetId]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,userId]` on the table `Tweet` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[retweetId,userId]` on the table `Tweet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `isPinned` to the `Tweet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tweet" ADD COLUMN     "isPinned" BOOLEAN NOT NULL,
ADD COLUMN     "retweetId" TEXT;

-- CreateTable
CREATE TABLE "Poll" (
    "id" TEXT NOT NULL,
    "options" TEXT[],
    "votes" INTEGER[],
    "tweetId" TEXT NOT NULL,

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Poll_tweetId_key" ON "Poll"("tweetId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_tweetId_key" ON "Bookmark"("userId", "tweetId");

-- CreateIndex
CREATE UNIQUE INDEX "Tweet_id_userId_key" ON "Tweet"("id", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Tweet_retweetId_userId_key" ON "Tweet"("retweetId", "userId");

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_retweetId_fkey" FOREIGN KEY ("retweetId") REFERENCES "Tweet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poll" ADD CONSTRAINT "Poll_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Tweet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
