/*
  Warnings:

  - You are about to drop the column `tweetId` on the `Poll` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pollId]` on the table `Tweet` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Poll" DROP CONSTRAINT "Poll_tweetId_fkey";

-- DropIndex
DROP INDEX "Poll_tweetId_key";

-- AlterTable
ALTER TABLE "Poll" DROP COLUMN "tweetId",
ALTER COLUMN "expiredAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tweet" ADD COLUMN     "pollId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Tweet_pollId_key" ON "Tweet"("pollId");

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE SET NULL ON UPDATE CASCADE;
