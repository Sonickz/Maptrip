/*
  Warnings:

  - Added the required column `price` to the `Citys` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Citys" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "history" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Citys" ("code", "createdAt", "description", "history", "id", "name") SELECT "code", "createdAt", "description", "history", "id", "name" FROM "Citys";
DROP TABLE "Citys";
ALTER TABLE "new_Citys" RENAME TO "Citys";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
