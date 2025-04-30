ALTER TABLE "vigil_events" ALTER COLUMN "date" SET DATA TYPE date USING "date"::date;
-- if dates are in 2024, set to 2025
UPDATE "vigil_events" SET "date" = "date" + INTERVAL '1 year' WHERE "date" < '2025-01-01';
