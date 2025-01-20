from transformers import BertTokenizer, BertForSequenceClassification
import torch
from sklearn.linear_model import LinearRegression
import googleapiclient.discovery

# Initialize API
api_key = 'AIzaSyDSHKHadLqXWN35dnvND0SFOubYdat3tis'
youtube = googleapiclient.discovery.build("youtube", "v3", developerKey=api_key)

# Load pretrained BERT model for sentiment analysis
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=3)

# Preprocess text
def preprocess_text(text):
    inputs = tokenizer(text, return_tensors='pt', max_length=512, truncation=True, padding=True)
    return inputs

# Predict sentiment
def predict_sentiment(text):
    inputs = preprocess_text(text)
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        sentiment = torch.argmax(logits, dim=1).item()
    sentiment_mapping = {0: 'Negative', 1: 'Neutral', 2: 'Positive'}
    return sentiment_mapping[sentiment]

# Fetch video details
def get_video_details(youtube, video_id):
    request = youtube.videos().list(
        part='snippet,statistics', id=video_id
    )
    response = request.execute()
    if not response['items']:
        return None
    video = response['items'][0]
    return video

# Predict engagement
def predict_engagement(features, model):
    return model.predict([features])[0]

# Main function
def analyze_video(video_id):
    video = get_video_details(youtube, video_id)
    if not video:
        print("Invalid Video ID or no data found.")
        return None

    title = video['snippet']['title']
    description = video['snippet']['description']
    tags = video['snippet'].get('tags', [])
    combined_text = f"{title} {description} {' '.join(tags)}"
    
    sentiment = predict_sentiment(combined_text)
    print(f"Predicted Sentiment: {sentiment}")

    # Assume engagement model is trained and loaded
    # engagement_model = ... (Load your trained regression model)
    # features = extract_features(combined_text)
    # predicted_engagement = predict_engagement(features, engagement_model)
    
    result = {
        'Title': title,
        'Description': description,
        'Tags': tags,
        'Sentiment': sentiment,
        # 'EngagementPrediction': predicted_engagement
    }
    return result

# Example Usage
video_id_to_analyze = "nISRiHNLNvI"
video_analysis = analyze_video(video_id_to_analyze)
if video_analysis:
    print(video_analysis)
