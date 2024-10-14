DO $$
DECLARE
    stmt RECORD;
BEGIN
    FOR stmt IN
        SELECT 'DROP FUNCTION ' || ns.nspname || '.' || proname || '(' || oidvectortypes(proargtypes) || ');' AS sql_statement
        FROM pg_proc p
        JOIN pg_namespace ns ON p.pronamespace = ns.oid
        WHERE ns.nspname NOT IN ('pg_catalog', 'information_schema')
        AND p.proisagg = false
    LOOP
        EXECUTE stmt.sql_statement;
    END LOOP;

    FOR stmt IN
        SELECT 'DROP TRIGGER ' || tgname || ' ON ' || ns.nspname || '.' || relname || ';' AS sql_statement
        FROM pg_trigger t
        JOIN pg_class c ON t.tgrelid = c.oid
        JOIN pg_namespace ns ON c.relnamespace = ns.oid
        WHERE NOT tgisinternal
    LOOP
        EXECUTE stmt.sql_statement;
    END LOOP;
END $$;
