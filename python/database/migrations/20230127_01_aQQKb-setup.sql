-- setup
-- depends:

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE FUNCTION updated_at() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

-- UDF Postgres implementation of TSIDs.
CREATE OR REPLACE FUNCTION b58_encode(num BIGINT)
RETURNS TEXT AS $$
DECLARE
  -- Sorted in "C" collation order; for this reason ID columns should be collated in C.
  alphabet   TEXT := '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  base_count BIGINT := char_length(alphabet);
  encoded    TEXT;
  divisor    BIGINT;
  mod        BIGINT;
BEGIN
  encoded := '';
  WHILE num >= base_count LOOP
    divisor := num / base_count;
    mod := num % base_count;
    encoded := concat(substring(alphabet FROM mod::INT + 1 FOR 1), encoded);
    num := divisor;
  END LOOP;
  RETURN concat(substring(alphabet FROM num::INT + 1 FOR 1), encoded);
END $$ LANGUAGE PLPGSQL;

DROP SEQUENCE IF EXISTS generate_id_seq;
CREATE SEQUENCE generate_id_seq MAXVALUE 1024 CYCLE;

CREATE OR REPLACE FUNCTION generate_id(prefix TEXT)
RETURNS TEXT AS $$
DECLARE
  -- Milliseconds precision
  c_milli_prec BIGINT := 10^3;
  -- Random component bit length: 12 bits
  c_random_len BIGINT := 2^12;
  -- TSID epoch: seconds since 2000-01-01Z
  -- extract(epoch from '2000-01-01'::date)
  c_tsid_epoch BIGINT := 946684800;
  -- 42 bits
  c_timestamp_component BIGINT := floor((extract('epoch' from now()) - c_tsid_epoch) * c_milli_prec);
  -- 12 bits
  c_random_component BIGINT := floor(random() * c_random_len);
  -- 10 bits
  c_counter_component BIGINT := nextval('generate_id_seq') - 1;
  tsid BIGINT := ((c_timestamp_component << 22) | (c_random_component << 10) | c_counter_component);
BEGIN
  RETURN prefix || '_' || b58_encode(tsid);
END $$ LANGUAGE plpgsql;
