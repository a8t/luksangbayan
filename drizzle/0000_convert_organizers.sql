-- First, create a temporary column
ALTER TABLE vigil_events ADD COLUMN organizers_new text;

-- Convert the data
UPDATE vigil_events 
SET organizers_new = CASE 
  WHEN organizers IS NULL THEN ''
  WHEN organizers = '[]'::jsonb THEN ''
  ELSE (SELECT string_agg(value, ', ') FROM jsonb_array_elements_text(organizers))
END;

-- Drop the old column
ALTER TABLE vigil_events DROP COLUMN organizers;

-- Rename the new column
ALTER TABLE vigil_events RENAME COLUMN organizers_new TO organizers;

-- Add the not null constraint
ALTER TABLE vigil_events ALTER COLUMN organizers SET NOT NULL; 