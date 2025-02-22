import datetime
import time
from collections import namedtuple
from pathlib import Path
import database
import jwt
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from werkzeug.security import check_password_hash, generate_password_hash
from sqlite3 import IntegrityError

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.config['SECRET_KEY'] = 'your_secret_key'


def generate_token(user):
    payload = {
        'id': user['id'],
        'email': user['email'],
        'firstName': user['first_name'],
        'lastName': user['last_name'],
        'role': user['role'],
        'exp':  datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)
    }
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    # Ensure token is a string
    return token if isinstance(token, str) else token.decode('utf-8')


@app.route('/auth/register', methods=['POST'])
@cross_origin()
def register():
    data = request.get_json()
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    # Validate required fields
    if not all([first_name, last_name, email, password, role]):
        return jsonify({'message': 'Missing required fields'}), 400

    hashed_password = generate_password_hash(password)
    conn = database.get_db_connection()
    cursor = conn.cursor()

    # Pre-check: see if the email already exists
    existing_user = cursor.execute('SELECT id FROM Users WHERE email = ?', (email,)).fetchone()
    if existing_user:
        conn.close()
        return jsonify({'message': 'User with this email already exists'}), 400

    try:
        # Attempt to insert new user
        cursor.execute(
            'INSERT INTO Users (first_name, last_name, role, email, password) VALUES (?, ?, ?, ?, ?)',
            (first_name, last_name, role, email, hashed_password)
        )
        conn.commit()
        user_id = cursor.lastrowid
    except Exception as e:
        # Roll back any changes on error and return a server error message
        conn.rollback()
        conn.close()
        return jsonify({'message': 'Failed to register user', 'error': str(e)}), 500

    # Fetch the newly inserted user
    user = cursor.execute('SELECT * FROM Users WHERE id = ?', (user_id,)).fetchone()
    conn.close()

    token = generate_token(user)
    return jsonify({
        'token': token,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'firstName': user['first_name'],
            'lastName': user['last_name'],
            'role': user['role']
        }
    }), 201


@app.route('/auth/login', methods=['POST'])
@cross_origin()
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Missing email or password'}), 400

    conn = database.get_db_connection()
    user = conn.execute('SELECT * FROM Users WHERE email = ?', (email,)).fetchone()
    conn.close()

    if user is None or not check_password_hash(user['password'], password):
        return jsonify({'message': 'Invalid credentials'}), 401

    token = generate_token(user)
    return jsonify({
        'token': token,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'firstName': user['first_name'],
            'lastName': user['last_name'],
            'role': user['role']
        }
    })


@app.route('/sendNotes', methods=['POST'])
@cross_origin()
def notes():
    chat_note = request.json

    EventsColumns = namedtuple('EventsColumns', ['operation_id', 'event_type', 'event_value'])

    new_events = EventsColumns(chat_note['operationId'], chat_note['eventType'], chat_note['eventValue'])

    # Insert note into database
    database.insert_into("Events", new_events._fields, new_events)
    
    # Return a confirmation response
    return jsonify({"status": "success", "received": chat_note}), 200


@app.route('/lastOperationId', methods=['GET'])
@cross_origin()
def last_operation_id():
    recent_op_id = database.get_last_operation_id()
    # Ensure a numeric value is returned even if the table is empty
    max_id = recent_op_id[0] if recent_op_id[0] is not None else 0
    return jsonify({"max_operation_id": max_id}), 200


# @app.route('/generateReport', methods=['POST'])
# def report():



def main():
    sqlite_file = Path("hospital.db")
    
    if not sqlite_file.exists():
        database.create_database()
    
    # database.insert_sample_data()


if __name__ == '__main__':
    main()
    app.run(debug=True)