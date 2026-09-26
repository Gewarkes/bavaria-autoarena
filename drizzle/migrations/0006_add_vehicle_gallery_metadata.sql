ALTER TABLE public.vehicles
  ADD COLUMN mobile_de_id text UNIQUE,
  ADD COLUMN cover_index integer,
  ADD COLUMN hover_index integer,
  ADD COLUMN seal_indices integer[] NOT NULL DEFAULT '{}'::integer[],
  ADD COLUMN gallery_hidden integer[] NOT NULL DEFAULT '{}'::integer[],
  ADD COLUMN image_count integer GENERATED ALWAYS AS (jsonb_array_length(images)) STORED;

COMMENT ON COLUMN public.vehicles.mobile_de_id IS 'mobile.de listing identifier used for one-time gallery imports.';
COMMENT ON COLUMN public.vehicles.cover_index IS 'Zero-based image index selected for card and primary gallery display.';
COMMENT ON COLUMN public.vehicles.hover_index IS 'Zero-based alternate image index used on pointer hover.';
COMMENT ON COLUMN public.vehicles.seal_indices IS 'Zero-based indices containing a carVertical seal.';
COMMENT ON COLUMN public.vehicles.gallery_hidden IS 'Zero-based image indices hidden from the public gallery.';