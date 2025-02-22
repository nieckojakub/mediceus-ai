from flask import Flask, jsonify, request
from flask_cors import CORS
import database
from pathlib import Path

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


@app.route('/sendNotes', methods=['POST'])
def notes():
    chat_note = request.json
    print(chat_note)

    
    # Return a confirmation response
    return jsonify({"status": "success", "received": chat_note}), 200

@app.route('/downloadReport', methods=['POST'])
def report():
    chat_note = request.json
    print(chat_note)

    
    # Return a confirmation response
    return jsonify({"status": "success", "received": chat_note}), 200


def main():
    sqlite_file = Path("hospital.db")
    
    if not sqlite_file.exists():
        database.create_database()
    
    database.insert_sample_data()


if __name__ == '__main__':
    main()
    app.run(debug=True)