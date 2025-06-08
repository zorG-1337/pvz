/*
  Warnings:

  - Added the required column `adminId` to the `PVZ` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PVZ" ADD COLUMN     "adminId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PVZ" ADD CONSTRAINT "PVZ_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
