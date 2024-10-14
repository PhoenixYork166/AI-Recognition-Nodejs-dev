CREATE OR REPLACE FUNCTION enforce_row_limit_on_image_record()
RETURNS TRIGGER AS $$
BEGIN
	-- Set max. row to 100 only
	IF (SELECT COUNT(*) FROM image_record) > 100 THEN
		-- Delete entries that exceed the 10-row limit
		DELETE FROM image_record
		WHERE id IN(
			SELECT id FROM image_record
			ORDER BY date_time ASC
			LIMIT (SELECT COUNT(*) - 10 FROM image_record)
		);
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;