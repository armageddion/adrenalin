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
