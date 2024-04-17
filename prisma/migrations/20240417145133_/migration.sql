/*
  Warnings:

  - The primary key for the `PassingAnswer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PassingAnswer` table. All the data in the column will be lost.
  - Made the column `testingPassingId` on table `PassingAnswer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PassingAnswer" DROP CONSTRAINT "PassingAnswer_pkey",
DROP COLUMN "id",
ALTER COLUMN "testingPassingId" SET NOT NULL,
ADD CONSTRAINT "PassingAnswer_pkey" PRIMARY KEY ("answerId", "testingPassingId");
