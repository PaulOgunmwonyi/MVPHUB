from flask import Flask, request, jsonify
from models import NFLAwardPredictor
from simple_explainer import SimpleExplainer
from chat_handler import ChatHandler
from flask_cors import CORS
from dotenv import load_dotenv
import json
import os
import warnings

# Suppress sklearn warnings
warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")

load_dotenv()

app = Flask(__name__)
CORS(app)

predictor = NFLAwardPredictor()
explainer = SimpleExplainer()
chat_handler = ChatHandler()

@app.route('/', methods=['GET'])
def home():
    return "NFL Award Predictor API is running.", 200

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data_in = request.json

        if not data_in:
            return jsonify({'error': 'No input data provided'}), 400

        result = predictor.predict(data_in)
        try:
            explanation = explainer.explain_prediction(data_in)
            result['explanation'] = explanation
        except Exception as explainer_error:
            print(f"Explainer failed: {explainer_error}")
            # Add a simple fallback explanation
            result['explanation'] = {
                'prediction_probability': result.get('probability', 0.5),
                'feature_impacts': [],
                'top_positive': [],
                'top_negative': [],
                'error': 'Explanation unavailable'
            }
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/data', methods=['GET'])
def get_data():
    try:
        with open('filtered_data.json') as f:
            data_out = json.load(f)
        return jsonify(data_out)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        message = data.get('message', '')
        prediction_data = data.get('prediction_data')
        
        response = chat_handler.handle_message(message, prediction_data)
        
        return jsonify(response)
    except Exception as e:
        print(f"Chat error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/explain', methods=['POST'])
def explain():
    try:
        data = request.json
        explanation = explainer.explain_prediction(data)
        return jsonify(explanation)
    except Exception as e:
        print(f"Explanation error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
