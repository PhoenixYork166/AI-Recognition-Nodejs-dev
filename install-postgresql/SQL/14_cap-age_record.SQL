CREATE OR REPLACE FUNCTION enforce_row_limit_on_age_record()
RETURNS TRIGGER AS $$
BEGIN
    -- Set max. row to 100 only
    IF (SELECT COUNT(*) FROM age_record) > 1000 THEN
        -- Delete entries that exceed the 1000-row limit
        DELETE FROM age_record
        WHERE id IN(
            SELECT id FROM age_record
            ORDER BY date_time DESC
            LIMIT (SELECT COUNT(*) - 1000 FROM age_record)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
