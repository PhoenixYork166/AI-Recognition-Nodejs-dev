CREATE OR REPLACE FUNCTION enforce_row_limit_on_image_details()
RETURNS TRIGGER AS $$
BEGIN
	-- Set max. row to 10 only
	IF (SELECT COUNT(*) FROM image_details) > 10 THEN
		-- Delete entries that exceed the 10-row limit
		DELETE FROM image_details
		WHERE id IN(
			SELECT id FROM image_details
			ORDER BY image_id ASC
			LIMIT (SELECT COUNT(*) - 10 FROM image_details)
		);
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;