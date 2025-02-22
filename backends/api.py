from flask import Flask, jsonify, request
from flask_cors import CORS
import database
from pathlib import Path
from services.eleven_labs import *
from utils.report_generator import *

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

    elevenLabsService = ElevenLabsService('sk_e59804fe295f2e5a8ae260951efa2e58133b807804c9072a')
    response = elevenLabsService.get_conversation(chat_note['conversationId'])
    
    response = json.loads(response)

    report = create_report(response, chat_note['surgeryDetails'])
    
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