-- CreateTable
CREATE TABLE "daily_menus" (
    "id" TEXT NOT NULL,
    "menuDate" DATE NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "title" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_menus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "daily_menus_menuDate_idx" ON "daily_menus"("menuDate");

-- CreateIndex
CREATE INDEX "daily_menus_isActive_idx" ON "daily_menus"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "daily_menus_menuDate_key" ON "daily_menus"("menuDate");
