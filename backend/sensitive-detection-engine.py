from flask import Flask, request
from transformers import pipeline
import re
from collections import OrderedDict


app = Flask(__name__)

# Load the zero-shot classification pipeline
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

def clean_text(text):
    # Remove special characters and symbols
    text = re.sub(r'[^\w\s]', '', text)
    
    # Remove extra whitespaces
    text = re.sub(r'\s+', ' ', text).strip()

    return text

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  # Assuming the input is in JSON format
    candidate_labels = data['labels']
    sequence_to_classify = clean_text(data['text'])

    # Set the maximum length for chunks
    max_length = 512

    # Split the cleaned text into chunks
    chunks = [sequence_to_classify[i:i + max_length] for i in range(0, len(sequence_to_classify), max_length)]

    # Classify each chunk and store the results
    results = [classifier(chunk, candidate_labels) for chunk in chunks]

    # Combine the results by averaging the scores
    combined_scores = {category: 0 for category in candidate_labels}
    for result in results:
        for i, category in enumerate(result["labels"]):
            combined_scores[category] += result["scores"][i]

    for category in combined_scores:
        combined_scores[category] /= len(results)
    
    return combined_scores

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)