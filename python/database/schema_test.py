import re
from dataclasses import dataclass

from sqlalchemy import text

from database.xact import xact_admin

# TODO(md): Check for *_id which are not FK-ed; they should probably be _extid.

nl = "\n"  # can't put backslash in f-string expression


async def test_all_tables_have_primary_keys():
    async with xact_admin() as q:
        cursor = await q.conn.execute(
            text(
                """
                SELECT t.table_name
                FROM information_schema.tables t
                WHERE t.table_type = 'BASE TABLE'
                    AND t.table_schema = 'public'
                    AND NOT EXISTS (
                        SELECT *
                        FROM information_schema.columns c
                        WHERE c.table_name = t.table_name
                        AND c.column_name = 'id'
                    )
                    AND t.table_name NOT LIKE '%yoyo%'
                    AND t.table_name NOT LIKE '%_enum'
                """
            )
        )
        failing = [row[0] for row in cursor.fetchall()]
        assert not failing, f"""\
Please update tables {", ".join(failing)} to have an `id` primary key column.

Primary keys should be defined as:

    id TEXT COLLATE "C" PRIMARY KEY DEFAULT generate_id('<prefix>') CHECK (id LIKE '<prefix>_%'),

Failing tables:
{nl.join(f"- {t}" for t in failing)}
"""  # pragma: no cover


DEFAULT_REGEX = re.compile(r"generate_id\('([^']+)'::text\)")


async def test_id_prefix_validation():
    async with xact_admin() as q:
        cursor = await q.conn.execute(
            text("""
                SELECT c.table_name, c.column_name, c.column_default
                FROM information_schema.columns c
                JOIN information_schema.tables t
                    ON c.table_name = t.table_name
                WHERE c.column_name = 'id'
                AND t.table_schema = 'public'
                AND t.table_type = 'BASE TABLE'
                AND t.table_name NOT LIKE '%yoyo%'
            """)
        )

        id_prefix_regex = re.compile(r"^[a-z]{2,3}$")

        seen_prefixes = set()
        for table, column, default in cursor.fetchall():
            m = DEFAULT_REGEX.match(default)
            assert m is not None
            prefix = m[1]
            ok = id_prefix_regex.match(prefix) is not None
            assert ok, f"""\
Table {table} has an invalid `{column}` column prefix. Prefixes must be 2-3 lowercase characters.
"""
            ok = prefix not in seen_prefixes
            assert ok, f"""\
    Table {table} has a duplicate `{column}` prefix. Please choose a new one.
    """
            seen_prefixes.add(prefix)


async def test_all_tables_have_metadata_columns():
    async with xact_admin() as q:
        cursor = await q.conn.execute(
            text("""
                SELECT t.table_name
                FROM information_schema.tables t
                WHERE t.table_type = 'BASE TABLE'
                    AND t.table_schema = 'public'
                    AND (
                        NOT EXISTS (
                            SELECT *
                            FROM information_schema.columns c
                            WHERE c.table_name = t.table_name
                                AND c.column_name = 'created_at'
                        )
                        OR NOT EXISTS (
                            SELECT *
                            FROM information_schema.columns c
                            WHERE c.table_name = t.table_name
                                AND c.column_name = 'updated_at'
                        )
                        OR NOT EXISTS (
                            SELECT *
                            FROM information_schema.columns c
                            WHERE c.table_name = t.table_name
                                AND c.column_name = 'storytime'
                        )
                    )
                    AND t.table_name NOT LIKE '%yoyo%'
                    AND t.table_name NOT LIKE '%_enum'
            """)
        )
        failing = [row[0] for row in cursor.fetchall()]
        assert not failing, f"""\
Please update tables {", ".join(failing)} to have created_at, updated_at and storytime columns.

Failing tables:
{nl.join(f"- {t}" for t in failing)}
"""  # pragma: no cover


async def test_all_created_and_updated_at_definition():
    async with xact_admin() as q:
        cursor = await q.conn.execute(
            text("""
                SELECT c.table_name, c.column_name
                FROM information_schema.columns c
                JOIN information_schema.tables t
                    ON c.table_name = t.table_name
                WHERE c.column_name IN ('created_at', 'updated_at')
                    AND t.table_schema = 'public'
                    AND t.table_type = 'BASE TABLE'
                    AND (
                        c.column_default IS DISTINCT FROM 'now()'
                        OR c.is_nullable = 'YES'
                    )
                    AND t.table_name NOT LIKE '%yoyo%'
            """)
        )
        failing = [f"{x[0]}.{x[1]}" for x in cursor.fetchall()]
        assert not failing, f"""\
Please update columns {", ".join(failing)} to NOT NULL DEFAULT NOW().

Failing columns:
{nl.join(f"- {t}" for t in failing)}
"""  # pragma: no cover


async def test_all_updated_at_columns_have_trigger():
    async with xact_admin() as q:
        cursor = await q.conn.execute(
            text("""
                SELECT c.table_name
                FROM information_schema.columns c
                JOIN information_schema.tables t
                    ON c.table_name = t.table_name
                WHERE c.column_name = 'updated_at'
                    AND t.table_schema = 'public'
                    AND t.table_type = 'BASE TABLE'
                    AND t.table_name NOT IN (
                        SELECT event_object_table
                        FROM information_schema.triggers
                        WHERE trigger_schema = 'public'
                            AND trigger_name = 'updated_at'
                            AND event_manipulation = 'UPDATE'
                            AND action_statement = 'EXECUTE FUNCTION updated_at()'
                            AND action_orientation = 'ROW'
                            AND action_timing = 'BEFORE'
                    )
                    AND t.table_name NOT LIKE '%yoyo%'
            """)
        )
        failing = [row[0] for row in cursor]
        assert not failing, f"""\
Please update tables {", ".join(failing)} to have an updated_at trigger.

Fixes:

{nl.join(f"CREATE TRIGGER updated_at BEFORE UPDATE ON {t} FOR EACH ROW EXECUTE PROCEDURE updated_at();" for t in failing)}
"""  # pragma: no cover


async def test_integers_should_be_bigints():
    async with xact_admin() as q:
        cursor = await q.conn.execute(
            text("""
                SELECT c.table_name, c.column_name
                FROM information_schema.columns c
                JOIN information_schema.tables t
                    ON c.table_name = t.table_name
                WHERE c.data_type = 'integer'
                    AND t.table_schema = 'public'
                    AND t.table_type = 'BASE TABLE'
                    AND t.table_name NOT LIKE '%yoyo%'
            """)
        )
        failing = [f"{x[0]}.{x[1]}" for x in cursor]
        assert not failing, f"""\
Please update columns {", ".join(failing)} to be of the BIGINT type.

32-bit integers are at risk of overflowing due to their smol size.

Failing columns:
{nl.join(f"- {t}" for t in failing)}
"""  # pragma: no cover


async def test_timestamps_should_be_timestamptz():
    async with xact_admin() as q:
        cursor = await q.conn.execute(
            text("""
                SELECT c.table_name, c.column_name
                FROM information_schema.columns c
                JOIN information_schema.tables t
                    ON c.table_name = t.table_name
                WHERE c.data_type = 'timestamp without time zone'
                    AND t.table_schema = 'public'
                    AND t.table_type = 'BASE TABLE'
                    AND t.table_name NOT LIKE '%yoyo%'
            """)
        )
        failing = [f"{x[0]}.{x[1]}" for x in cursor]
        assert not failing, f"""\
Please update columns {", ".join(failing)} to be of the TIMESTAMPTZ type.

Failing columns:
{nl.join(f"- {t}" for t in failing)}
"""  # pragma: no cover


@dataclass
class MissingFK:
    table: str
    columns: list[str]


async def test_foreign_key_indexes():
    async with xact_admin() as q:
        cursor = await q.conn.execute(
            text("""
                -- Based on https://www.cybertec-postgresql.com/en/index-your-foreign-key/.
                SELECT
                    c.conrelid::regclass AS table,
                    -- List of key column names in order.
                    array_agg(a.attname ORDER BY x.n)::TEXT[] AS columns
                FROM pg_catalog.pg_constraint c
                    -- Enumerated key column numbers per foreign key.
                    CROSS JOIN LATERAL unnest(c.conkey) WITH ORDINALITY AS x(attnum, n)
                    -- Name for each key column.
                    JOIN pg_catalog.pg_attribute a ON a.attnum = x.attnum AND a.attrelid = c.conrelid
                WHERE
                    -- Is there a matching index for the constraint? A matching index is one that has the
                    -- first column set to the foreign key column and is not partial.
                    NOT EXISTS (
                        SELECT FROM pg_catalog.pg_index i
                        WHERE i.indrelid = c.conrelid
                            -- It must not be a partial index.
                            AND i.indpred IS NULL
                            -- The first index columns must be the same as the key columns, but order
                            -- doesn't matter.
                            AND (i.indkey::smallint[])[0:cardinality(c.conkey)-1]
                                OPERATOR(pg_catalog.@>) c.conkey
                    )
                    -- Is there a matching partial index for this constraint? This only allowed for cases
                    -- where a single column is being indexed and the expression is IS NOT NULL. This allows
                    -- for more optimized nullable foreign key indexes.
                    AND NOT EXISTS (
                        SELECT FROM pg_catalog.pg_index i
                        WHERE i.indrelid = c.conrelid
                            -- It must have a single indexed column.
                            AND array_length(indkey::smallint[], 1) = 1
                            -- The predicate is IS NOT NULL
                            AND pg_get_expr(i.indpred, i.indrelid) LIKE '(% IS NOT NULL)'
                            -- The first index columns must be the same as the key columns, but order
                            -- doesn't matter.
                            AND (i.indkey::smallint[])[0:cardinality(c.conkey)-1]
                                OPERATOR(pg_catalog.@>) c.conkey
                    )
                    AND c.contype = 'f'
                GROUP BY c.conrelid, c.conname
            """)
        )
        failing = [MissingFK(table=x[0], columns=x[1]) for x in cursor]
        assert not failing, f"""\
Please add indexes on foreign keys {", ".join([f"{x.table} ({','.join(x.columns)})" for x in failing])}.

See https://www.cybertec-postgresql.com/en/index-your-foreign-key/ for rationale.

Fixes:

{nl.join([f"CREATE INDEX {x.table}_{'_'.join(x.columns)}_idx ON {x.table} ({', '.join(x.columns)});" for x in failing])}
"""  # pragma: no cover


async def test_id_columns_have_check_constraint():
    async with xact_admin() as q:
        cursor = await q.conn.execute(
            text(
                """
                SELECT c.table_name, c.column_name
                FROM information_schema.columns c
                JOIN information_schema.tables t
                    ON c.table_name = t.table_name
                WHERE c.column_name = 'id'
                    AND t.table_schema = 'public'
                    AND t.table_type = 'BASE TABLE'
                    AND t.table_name NOT LIKE '%yoyo%'
                """
            )
        )
        cols = [(x[0], x[1]) for x in cursor.fetchall()]

        cursor = await q.conn.execute(
            text("""
                SELECT tc.table_name, kcu.column_name
                FROM information_schema.table_constraints tc
                JOIN information_schema.constraint_column_usage kcu
                    ON tc.constraint_name = kcu.constraint_name AND tc.table_name = kcu.table_name
                WHERE tc.constraint_type = 'CHECK'
                AND kcu.column_name = 'id'
            """)
        )
        constraints = [(x[0], x[1]) for x in cursor.fetchall()]
        failing = [c for c in cols if c not in constraints]
        assert not failing, f"""\
Please add a CHECK constraint with a prefix match to the following columns:

{nl.join([f"- {x}" for x in failing])}
"""  # pragma: no cover


async def test_id_columns_have_collation_c():
    async with xact_admin() as q:
        cursor = await q.conn.execute(
            text("""
                SELECT t.table_name, c.column_name, c.collation_name
                FROM information_schema.tables t
                JOIN information_schema.columns c ON c.table_name = t.table_name
                WHERE t.table_type = 'BASE TABLE'
                    AND t.table_schema = 'public'
                    AND (c.column_name = 'id' OR c.column_name LIKE '%_id')
                    AND (c.collation_name != 'C' OR c.collation_name IS NULL)
                    AND t.table_name NOT LIKE '%yoyo%'
            """)
        )
        failing = list(cursor.fetchall())

        assert not failing, f"""\
The following ID columns must use COLLATE "C":

{nl.join(f"- {x[0]}.{x[1]} (current collation: {x[2]})" for x in failing)}

ID columns should be defined as:

    id TEXT COLLATE "C" PRIMARY KEY DEFAULT generate_id('<prefix>') CHECK (id LIKE '<prefix>_%'),

Foreign key columns referencing ID columns should be defined as:
    other_id TEXT COLLATE "C" REFERENCES other_table(id)
"""  # pragma: no cover
