from flask import Flask, request, jsonify
from models import NFLAwardPredictor
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def home():
    return "NFL Award Predictor API is running.", 200

@app.route('/predict', methods=['POST'])
def predict():
    data_in = request.json
    predictor = NFLAwardPredictor()
    result = predictor.predict(data_in)
    return jsonify(result)

@app.route('/data', methods=['GET'])
def get_data():
    with open('filtered_data.json') as f:
        data_out = json.load(f)
    return jsonify(data_out)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
