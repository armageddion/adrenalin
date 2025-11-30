#!/bin/bash

# Fail fast and handle unset variables
set -euo pipefail

# Ensure script runs relative to its own directory so relative files resolve
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Create script directory for exports
mkdir -p "$SCRIPT_DIR/script"

# ==========================================
# CONFIGURATION
# ==========================================
DB_HOST="aws-0-eu-central-1.pooler.supabase.com"
DB_PORT="6543"
DB_USER="postgres.xslzbecbfgzgmwkqyezp"
DB_NAME="postgres"
PGPASSWORD=$(cat PGPASSWORD.txt)
export PGPASSWORD

# Output filenames
SQLITE_DB="output.db"

# ==========================================
# 1. CHECK PREREQUISITES
# ==========================================
if ! command -v pg_dump &> /dev/null; then
    echo "Error: pg_dump is not installed."
    exit 1
fi

if ! command -v sqlite3 &> /dev/null; then
    echo "Error: sqlite3 is not installed."
    exit 1
fi

if [ ! -f "$SCRIPT_DIR/PGPASSWORD.txt" ]; then
    echo "Error: PGPASSWORD.txt file not found in $SCRIPT_DIR."
    exit 1
fi

PGPASSWORD=$(cat "$SCRIPT_DIR/PGPASSWORD.txt")
export PGPASSWORD

if [ -z "$PGPASSWORD" ]; then
    echo "Error: PGPASSWORD.txt is empty."
    exit 1
fi

echo "Using PGPASSWORD from PGPASSWORD.txt..."

# ==========================================
# 2. CREATE SQLITE DATABASE
# ==========================================
echo "Creating SQLite database: $SQLITE_DB..."

# Remove existing db if it exists to ensure clean import
if [ -f "$SQLITE_DB" ]; then
    rm "$SQLITE_DB"
fi

# Create tables from schema (use absolute path)
sqlite3 "$SQLITE_DB" < "$SCRIPT_DIR/schema.sql"

# ==========================================
# 3. MIGRATE TABLES
# ==========================================
TABLES=("packages" "messages" "members" "visits")

for TABLE in "${TABLES[@]}"; do
    echo "Processing table: $TABLE"

    # Dump table data
    TEMP_DUMP="$SCRIPT_DIR/script/${TABLE}.sql"
    PGPASSWORD="$PGPASSWORD" pg_dump \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        --schema=public \
        --table="$TABLE" \
        --data-only \
        --no-owner \
        --no-acl \
        --column-inserts \
        --quote-all-identifiers \
        --file="$TEMP_DUMP"

    if [ $? -ne 0 ]; then
        echo "Error: pg_dump failed for table $TABLE."
        exit 1
    fi

    # Convert to SQLite format
    TEMP_SQLITE="$SCRIPT_DIR/script/${TABLE}_sqlite.sql"
    SED_ARGS=(-e '/^SET/d'
         -e '/^SELECT pg_catalog/d'
         -e '/^CREATE EXTENSION/d'
         -e '/^COMMENT ON/d'
         -e '/ROW LEVEL SECURITY/d'
         -e 's/"public"\.//g'
         -e 's/public\.//g'
         -e 's/"adress"/"address_street"/g'
         -e 's/"adress_number"/"address_number"/g'
         -e 's/INSERT INTO/INSERT OR REPLACE INTO/g'
         -e 's/::[a-zA-Z0-9_ ]*//g'
         -e "s/ E'/ '/g"
         -e "s/,E'/, '/g"
         -e "s/(E'/( '/g"
         -e 's/FALSE/0/g'
         -e 's/TRUE/1/g'
         -e 's/false/0/g'
         -e 's/true/1/g'
         -e 's/jsonb/text/g'
         -e 's/json/text/g'
         -e 's/timestamptz/text/g'
         -e 's/timestamp without time zone/text/g'
         -e 's/bigint/integer/g'
         -e 's/smallint/integer/g'
         -e 's/character varying/text/g'
         -e 's/DEFAULT now()/DEFAULT CURRENT_TIMESTAMP/g'
         -e 's/"position"/"display_order"/g')

    cat > "$SCRIPT_DIR/process_table.py" << 'EOF'
import sys
import os
import re
table = sys.argv[1] if len(sys.argv) > 1 else 'unknown'
current = ''
for line in sys.stdin:
    current += line
    if ');' in current:
        full_line = current.rstrip()
        print("Original: " + full_line, file=sys.stderr)
        processed_line = full_line
        if table == 'packages':
            if 'INSERT OR REPLACE INTO "packages"' in full_line and 'VALUES' in full_line:
                parts = full_line.split('VALUES (', 1)
                if len(parts) == 2:
                    prefix_columns = parts[0].replace('"description", "display_order"', '"price", "description", "display_order"')
                    prefix = prefix_columns + 'VALUES ('
                    rest = parts[1]
                    if rest.endswith(');'):
                        values_str = rest[:-2]
                        vals = re.findall(r"'[^']*'|[^,]+", values_str)
                        vals = [v.strip() for v in vals]
                        if len(vals) == 4:
                            id_val = vals[0]
                            name_val = vals[1]
                            desc_quoted = vals[2]
                            order_val = vals[3]
                            desc = desc_quoted.strip("'")
                            match = re.search(r'\*\*(\d+)\*\*', desc)
                            if match:
                                price_num = int(match.group(1))
                                price_str = str(price_num)
                                new_desc = re.sub(r'\*\*' + str(price_num) + r'\*\*\s*', str(price_num), desc)
                                new_desc_quoted = "'" + new_desc + "'"
                            else:
                                price_str = 'NULL'
                                new_desc_quoted = desc_quoted
                            new_vals = [id_val, name_val, price_str, new_desc_quoted, order_val]
                            processed_line = prefix + ', '.join(new_vals) + ');'
        elif table == 'members':
            if 'INSERT OR REPLACE INTO "members"' in full_line and 'VALUES' in full_line:
                parts = full_line.split('VALUES (', 1)
                if len(parts) == 2:
                    rest = parts[1]
                    if rest.endswith(');'):
                        values_str = rest[:-2]
                        vals = re.findall(r"'[^']*'|[^,]+", values_str)
                        vals = [v.strip() for v in vals]
                        # Columns: id(0), package_id(1), card_id(2), gov_id(3), created_at(4), updated_at(5), year_of_birth(6), first_name(7), last_name(8), ...
                        if len(vals) >= 9:
                            first_name = vals[7].strip()
                            last_name = vals[8].strip()
                            if first_name.strip("'").upper() == 'NULL' and last_name.strip("'").upper() == 'NULL':
                                # Skip this insert
                                processed_line = ''
                            else:
                                # Replace NULL with 'MISSING'
                                if vals[2].strip("'").upper() == 'NULL':
                                    vals[2] = "'MISSING'"
                                if first_name.strip("'").upper() == 'NULL':
                                    vals[7] = "'MISSING'"
                                if last_name.strip("'").upper() == 'NULL':
                                    vals[8] = "'MISSING'"
                                # Reconstruct the line
                                new_values = ', '.join(vals)
                                processed_line = parts[0] + 'VALUES (' + new_values + ');'
                        else:
                            processed_line = full_line
                    else:
                        processed_line = full_line
                else:
                    processed_line = full_line
            else:
                processed_line = full_line
        # Placeholder for other tables - add specific parsing here as needed
        # elif table == 'messages':
        #     # Add messages-specific processing
        # elif table == 'visits':
        #     # Add visits-specific processing
        print("Processed: " + processed_line, file=sys.stderr)
        print(processed_line)
        current = ''
EOF
    cat "$TEMP_DUMP" | sed "${SED_ARGS[@]}" | python3 "$SCRIPT_DIR/process_table.py" "$TABLE" | sed '/^$/d' > "$TEMP_SQLITE"

    echo "Converted SQL for $TABLE (first 50 lines):"
    head -n 50 "$TEMP_SQLITE"
    echo "--- End of preview ---"

    # Import into SQLite
    if ! sqlite3 "$SQLITE_DB" < "$TEMP_SQLITE" 2>&1; then
        echo "Error during SQLite import for table $TABLE."
        echo "Showing lines around the error (if applicable):"
        sed -n '30,50p' "$TEMP_SQLITE" || true
        exit 1
    fi

    # Validation: Compare row counts
    PG_COUNT=$(PGPASSWORD="$PGPASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM $TABLE;" | tr -d ' ')
    SQLITE_COUNT=$(sqlite3 "$SQLITE_DB" "SELECT COUNT(*) FROM $TABLE;")
    echo "PostgreSQL row count for $TABLE: $PG_COUNT"
    echo "SQLite row count for $TABLE: $SQLITE_COUNT"
    if [ "$PG_COUNT" -eq "$SQLITE_COUNT" ]; then
        echo "Row counts match for $TABLE."
    else
        echo "Warning: Row counts do not match for $TABLE. PostgreSQL: $PG_COUNT, SQLite: $SQLITE_COUNT"
    fi

    echo "Table $TABLE migrated successfully."
    read -p "Press Enter to proceed to next table, or type 'exit' to quit: " input
    if [ "$input" = "exit" ]; then
        echo "Exiting migration."
        break
    fi
done

# Adjust visits columns
sqlite3 "$SQLITE_DB" "UPDATE visits SET visit_date = date(created_at), notes = NULL WHERE visit_date IS NULL;"

# ==========================================
# 5. HANDLE PACKAGE MAPPING
# ==========================================
echo "Handling package mapping..."

# Assuming members have 'package' column with text names
# Rename to package_old and create package_id
sqlite3 "$SQLITE_DB" <<EOF
-- Insert unique packages into packages table
INSERT OR IGNORE INTO packages (name)
SELECT DISTINCT package_old FROM members WHERE package_old IS NOT NULL;
-- Update members with package_id
UPDATE members SET package_id = (SELECT id FROM packages WHERE name = members.package_old);
EOF

if [ $? -ne 0 ]; then
    echo "Error during package mapping."
    exit 1
fi

echo "Package mapping complete."

# ==========================================
# 6. VALIDATION
# ==========================================
echo "Running validation..."

# Row counts
MEMBERS_COUNT=$(sqlite3 "$SQLITE_DB" "SELECT COUNT(*) FROM members;")
PACKAGES_COUNT=$(sqlite3 "$SQLITE_DB" "SELECT COUNT(*) FROM packages;")
VISITS_COUNT=$(sqlite3 "$SQLITE_DB" "SELECT COUNT(*) FROM visits;")
MESSAGES_COUNT=$(sqlite3 "$SQLITE_DB" "SELECT COUNT(*) FROM messages;")

echo "Row counts:"
echo "  Members: $MEMBERS_COUNT"
echo "  Packages: $PACKAGES_COUNT"
echo "  Visits: $VISITS_COUNT"
echo "  Messages: $MESSAGES_COUNT"


echo "--------------------------------------"
echo "Migration Complete!"
echo "SQLite Database: $SQLITE_DB"
echo "--------------------------------------"