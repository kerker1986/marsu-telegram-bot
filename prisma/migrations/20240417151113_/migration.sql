/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Testing` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Testing_title_key" ON "Testing"("title");
