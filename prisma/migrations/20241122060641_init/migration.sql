/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Citys` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Citys` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Citys_code_key" ON "Citys"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Citys_name_key" ON "Citys"("name");
