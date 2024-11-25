/*
  Warnings:

  - A unique constraint covering the columns `[preferenceId]` on the table `Travels` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Travels_preferenceId_key" ON "Travels"("preferenceId");
