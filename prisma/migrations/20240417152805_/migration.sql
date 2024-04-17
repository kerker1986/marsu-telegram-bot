-- AlterEnum
ALTER TYPE "StatusEnum" ADD VALUE 'passing_question';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passingTestingId" TEXT;
