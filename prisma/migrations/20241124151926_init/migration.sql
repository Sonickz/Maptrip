-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Travels" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "persons" INTEGER NOT NULL,
    "dateStart" DATETIME NOT NULL,
    "dateEnd" DATETIME NOT NULL,
    "cityId" INTEGER NOT NULL,
    "transportId" INTEGER NOT NULL,
    "paymentId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Travels_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Travels_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "Citys" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Travels_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "Transports" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Travels" ("cityId", "createdAt", "dateEnd", "dateStart", "id", "paymentId", "persons", "price", "transportId", "userId") SELECT "cityId", "createdAt", "dateEnd", "dateStart", "id", "paymentId", "persons", "price", "transportId", "userId" FROM "Travels";
DROP TABLE "Travels";
ALTER TABLE "new_Travels" RENAME TO "Travels";
CREATE UNIQUE INDEX "Travels_paymentId_key" ON "Travels"("paymentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
