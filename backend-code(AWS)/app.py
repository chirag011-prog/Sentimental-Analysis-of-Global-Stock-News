from flask import Flask, jsonify
from flask_cors import CORS
import boto3

app = Flask(__name__)
CORS(app)

# AWS Setup
dynamodb = boto3.resource("dynamodb", region_name="ap-south-1")
table = dynamodb.Table("NewsSentiment")

@app.route("/")
def home():
    return jsonify({"message": "Flask API is working!"})

@app.route("/get-news", methods=["GET"])
def get_news():
    response = table.scan()
    news_items = response.get("Items", [])

    # Sort by timestamp (newest first)
    news_items.sort(key=lambda x: x["timestamp"], reverse=True)

    # Separate into categories
    positive = [item for item in news_items if item["sentiment"] == "POSITIVE"][:5]
    negative = [item for item in news_items if item["sentiment"] == "NEGATIVE"][:5]
    neutral = [item for item in news_items if item["sentiment"] == "NEUTRAL"][:5]

    return jsonify({"positive": positive, "negative": negative, "neutral": neutral})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
