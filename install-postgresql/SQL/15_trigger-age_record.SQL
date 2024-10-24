CREATE TRIGGER trigger_check_row_limit_on_age_record
AFTER INSERT ON age_record
FOR EACH ROW EXECUTE PROCEDURE enforce_row_limit_on_age_record();