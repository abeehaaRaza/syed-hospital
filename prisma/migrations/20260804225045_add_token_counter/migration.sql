-- CreateTable
CREATE TABLE "TokenCounter" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "currentCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TokenCounter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TokenCounter_date_key" ON "TokenCounter"("date");
