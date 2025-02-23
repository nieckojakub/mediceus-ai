import sqlite3


def get_db_connection():
    conn = sqlite3.connect("hospital.db")
    conn.row_factory = sqlite3.Row
    return conn


def get_last_operation_id():
    # Connect to the sqlite database
    conn = get_db_connection()
    cursor = conn.cursor()
    # Execute the query to get the maximum operation_id from the Events table
    cursor.execute("SELECT MAX(operation_id) FROM Events")
    result = cursor.fetchone()
    conn.close()

    return result


def create_database():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            role TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS OperatingRoom (
            room_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            is_available BOOLEAN NOT NULL DEFAULT 1
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Operation (
            operation_id INTEGER PRIMARY KEY AUTOINCREMENT,
            room_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            patient_first_name TEXT NOT NULL,
            patient_last_name TEXT NOT NULL,
            patient_pesel TEXT NOT NULL,
            operation_type TEXT NOT NULL,
            FOREIGN KEY (room_id) REFERENCES OperatingRoom(room_id),
            FOREIGN KEY (user_id) REFERENCES Users(id)
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Events (
            event_id INTEGER PRIMARY KEY AUTOINCREMENT,
            operation_id INTEGER NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            event_type TEXT NOT NULL,
            event_value TEXT NOT NULL,
            FOREIGN KEY (operation_id) REFERENCES Operation(operation_id)
        )
    ''') 

    conn.commit()
    conn.close()


def insert_into(table_name, columns, row):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    placeholders = ", ".join(["?"] * len(row))  # Create placeholders dynamically
    query = f"INSERT INTO {table_name} {columns} VALUES ({placeholders})"
    
    cursor.execute(query, row)  # Execute query with safe parameterized values
    row_id = cursor.lastrowid  # Get the last inserted row's ID

    conn.commit()
    conn.close()
    
    return row_id  # Return the newly created row id



def insert_sample_data():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Dodanie użytkowników
    cursor.executemany('''
        INSERT OR IGNORE INTO Users (first_name, last_name, role, email, password)
        VALUES (?, ?, ?, ?, ?)
    ''', [
        ("Jan", "Kowalski", "Doctor", "jan.kowalski@example.com", "password123"),
        ("Anna", "Nowak", "Nurse", "anna.nowak@example.com", "securepass"),
        ("Piotr", "Wiśniewski", "Surgeon", "piotr.wisniewski@example.com", "strongpassword")
    ])

    # Dodanie sal operacyjnych
    cursor.executemany('''
        INSERT INTO OperatingRoom (name, is_available)
        VALUES (?, ?)
    ''', [
        ("Sala 101", 1),
        ("Sala 102", 1),
        ("Sala 103", 0)  # Sala zajęta
    ])

    # Dodanie operacji
    cursor.executemany('''
        INSERT INTO Operation (room_id, user_id, patient_first_name, patient_last_name, patient_pesel, operation_type)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', [
        (1, 1, "Tomasz", "Lis", "90010112345", "Appendectomy"),
        (2, 3, "Marek", "Zieliński", "85050567890", "Heart Bypass"),
        (3, 1, "Katarzyna", "Dąbrowska", "92031245678", "Knee Replacement")
    ])

    # Pobranie ID operacji, aby dodać powiązane zdarzenia
    cursor.execute("SELECT operation_id FROM Operation WHERE patient_pesel = '90010112345'")
    operation_1_id = cursor.fetchone()[0]

    cursor.execute("SELECT operation_id FROM Operation WHERE patient_pesel = '85050567890'")
    operation_2_id = cursor.fetchone()[0]

    # Dodanie zdarzeń do operacji
    cursor.executemany('''
        INSERT INTO Events (operation_id, event_type, event_value)
        VALUES (?, ?, ?)
    ''', [
        (operation_1_id, "anestesia", "Patient admitted"),
        (operation_1_id, "medicine", "Anesthesia applied"),
        (operation_1_id, "medicine", "Surgery started"),
        (operation_1_id, "medicine", "Surgery completed"),
        (operation_2_id, "medicine", "Patient admitted"),
        (operation_2_id, "medicine", "Initial diagnostics performed"),
        (operation_2_id, "medicine", "Surgery in progress")
    ])

    conn.commit()
    conn.close()