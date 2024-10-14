CREATE OR REPLACE FUNCTION enforce_row_limit_on_image_details()
RETURNS TRIGGER AS $$
BEGIN
    -- Set max. row to 5000 only
    IF (SELECT COUNT(*) FROM image_details) > 5000 THEN
        -- Delete entries that exceed the 20-row limit
        DELETE FROM image_details
        WHERE id IN(
            SELECT id FROM image_details
            ORDER BY image_id ASC
            LIMIT (SELECT COUNT(*) - 5000 FROM image_details)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;