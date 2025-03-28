import sqlite3
import pandas as pd
from datetime import datetime

# File paths
EXCEL_FILE = "PJL AW25 Returns COPY.xlsx"
SHEET_NAME = "Ecom ret"
DB_FILE = "inventory.db"

# Load the Excel sheet
df = pd.read_excel(EXCEL_FILE, sheet_name=SHEET_NAME)
df = df[df["Rack"].notna()]

# Connect to SQLite
conn = sqlite3.connect(DB_FILE)
cursor = conn.cursor()

# Recreate tables
cursor.execute("DROP TABLE IF EXISTS items")
cursor.execute("DROP TABLE IF EXISTS racks")
cursor.execute("DROP TABLE IF EXISTS item_history")

cursor.execute('''
    CREATE TABLE racks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        level TEXT,
        raw_name TEXT
    )
''')

cursor.execute('''
    CREATE TABLE items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ean TEXT,
        division TEXT,
        style_name TEXT,
        model TEXT,
        color_name TEXT,
        size TEXT,
        box TEXT,
        rack_id INTEGER,
        last_updated TEXT,
        FOREIGN KEY (rack_id) REFERENCES racks(id)
    )
''')

cursor.execute('''
    CREATE TABLE item_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ean TEXT,
        division TEXT,
        style_name TEXT,
        model TEXT,
        color_name TEXT,
        size TEXT,
        box TEXT,
        rack_id INTEGER,
        timestamp TEXT
    )
''')

# Helper to determine level from rack suffix
def get_level(rack_code):
    if rack_code.endswith("A"):
        return "Alto"
    elif rack_code.endswith("B"):
        return "Bajo"
    else:
        return "Unknown"

now = datetime.now().isoformat()

# Insert data
for _, row in df.iterrows():
    rack_raw = str(row["Rack"]).strip()
    parts = rack_raw.split(" ")

    if len(parts) == 2:
        box = parts[0]
        rack_name = parts[1]
    else:
        box = None
        rack_name = parts[0]

    level = get_level(rack_name)

    # Insert or get rack_id
    cursor.execute("SELECT id FROM racks WHERE name = ?", (rack_name,))
    rack = cursor.fetchone()

    if rack:
        rack_id = rack[0]
    else:
        cursor.execute("INSERT INTO racks (name, level, raw_name) VALUES (?, ?, ?)", (rack_name, level, rack_raw))
        rack_id = cursor.lastrowid

    # Insert into items table
    cursor.execute('''
        INSERT INTO items (ean, division, style_name, model, color_name, size, box, rack_id, last_updated)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        row.get("EAN"),
        row.get("Div"),
        row.get("Style name"),
        row.get("Model Color"),
        row.get("Color name"),
        row.get("SIZE"),
        box,
        rack_id,
        now
    ))

    # Insert into history table
    cursor.execute('''
        INSERT INTO item_history (ean, division, style_name, model, color_name, size, box, rack_id, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        row.get("EAN"),
        row.get("Div"),
        row.get("Style name"),
        row.get("Model Color"),
        row.get("Color name"),
        row.get("SIZE"),
        box,
        rack_id,
        now
    ))

# Commit & close
conn.commit()
conn.close()

print("✔ Inventory imported into SQLite (inventory.db) with history tracking")
