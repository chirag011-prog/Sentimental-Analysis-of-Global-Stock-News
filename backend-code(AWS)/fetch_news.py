import requests
import boto3
import datetime
import uuid
import time

# AWS Setup
dynamodb = boto3.resource("dynamodb", region_name="ap-south-1")
table = dynamodb.Table("NewsSentiment")
comprehend = boto3.client("comprehend", region_name="ap-south-1")

API_KEY = 'your_key'
URL = f"https://newsapi.org/v2/everything?q=stock%20market&language=en&apiKey={API_KEY}"

def fetch_and_analyze_news():
    response = requests.get(URL).json()

    if "articles" not in response:
        print("Error fetching news")
        return

    articles = response["articles"]
    news_items = []

    for article in articles:
        title = article.get("title", "No Title")
        source = article["source"].get("name", "Unknown Source")

        # AI Sentiment Analysis
        sentiment_result = comprehend.detect_sentiment(Text=title, LanguageCode="en")
        sentiment = sentiment_result["Sentiment"]

        news_item = {
            "news_id": str(uuid.uuid4()),
            "title": title,
            "source": source,
            "sentiment": sentiment,
            "timestamp": str(datetime.datetime.now()),
        }

        news_items.append(news_item)

    # Sort news by timestamp (latest first)
    news_items.sort(key=lambda x: x["timestamp"], reverse=True)

    # Store in DynamoDB
    with table.batch_writer() as batch:
        for news in news_items:
            batch.put_item(Item=news)

    print(f"Stored {len(news_items)} news articles.")
    
# Run every 3 hours
while True:
    fetch_and_analyze_news()
    print("News updated. Waiting for 3 hours...")
    time.sleep(10800)  # 10800 seconds = 3 hours
