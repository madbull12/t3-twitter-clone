/*
  Warnings:

  - Added the required column `name` to the `List` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "List" ADD COLUMN     "coverPhoto" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT NOT NULL;
