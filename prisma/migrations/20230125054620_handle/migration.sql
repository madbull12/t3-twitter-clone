/*
  Warnings:

  - A unique constraint covering the columns `[handle]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "handle" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_handle_key" ON "User"("handle");
