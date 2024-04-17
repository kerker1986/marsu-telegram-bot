/*
  Warnings:

  - The values [passing_question] on the enum `StatusEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusEnum_new" AS ENUM ('start', 'check_testing', 'create_testing', 'create_question', 'create_answer', 'passing_testing', 'pick_answer', 'pick_correct_answer', 'save_testing');
ALTER TABLE "User" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "status" TYPE "StatusEnum_new" USING ("status"::text::"StatusEnum_new");
ALTER TYPE "StatusEnum" RENAME TO "StatusEnum_old";
ALTER TYPE "StatusEnum_new" RENAME TO "StatusEnum";
DROP TYPE "StatusEnum_old";
ALTER TABLE "User" ALTER COLUMN "status" SET DEFAULT 'start';
COMMIT;
