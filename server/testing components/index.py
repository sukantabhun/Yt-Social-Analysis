import googleapiclient.discovery
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib


api_key = 'AIzaSyDSHKHadLqXWN35dnvND0SFOubYdat3tis'
channel_id = 'UCcrre-0GY058UHMTB2iWoqQ'

youtube = googleapiclient.discovery.build("youtube", "v3", developerKey=api_key)

print("Starting channel data extraction...")

def get_channel_states(youtube, channel_id):
    request = youtube.channels().list(
        part='snippet,contentDetails,statistics', id=channel_id
    )
    response = request.execute()
    response = response['items'][0]
    data = dict(
        Channel_name=response['snippet']['title'],
        Subscribers=response['statistics']['subscriberCount'],
        ViewCount=response['statistics']['viewCount'],
        VideoCount=response['statistics']['videoCount'],
        PlaylistId=response['contentDetails']['relatedPlaylists']['uploads']
    )
    return data

channel_data = get_channel_states(youtube, channel_id)
channel_df = pd.DataFrame([channel_data])

channel_df['Subscribers'] = pd.to_numeric(channel_df['Subscribers'])
channel_df['ViewCount'] = pd.to_numeric(channel_df['ViewCount'])
channel_df['VideoCount'] = pd.to_numeric(channel_df['VideoCount'])

playlist_id = channel_data['PlaylistId']
print("Starting video ID extraction...")

def get_video_ids(youtube, playlist_id):
    video_ids = []
    request = youtube.playlistItems().list(
        part='contentDetails', playlistId=playlist_id, maxResults=50
    )
    while request:
        response = request.execute()
        video_ids += [item['contentDetails']['videoId'] for item in response['items']]
        request = youtube.playlistItems().list_next(request, response)
    return video_ids

video_ids = get_video_ids(youtube, playlist_id)
print(f"Extracted {len(video_ids)} video IDs.")
print("Starting video details extraction...")

def get_video_details(youtube, video_ids):
    all_video_stats = []
    for i in range(0, len(video_ids), 50):
        request = youtube.videos().list(
            part='snippet,statistics', id=','.join(video_ids[i:i + 50])
        )
        response = request.execute()
        print(f"Processing batch {i // 50 + 1} of {len(video_ids) // 50 + 1}")
        for video in response.get('items', []):
            stats = video.get('statistics', {})
            video_stats = dict(
                Title=video['snippet']['title'],
                PublishedDate=video['snippet']['publishedAt'],
                Views=int(stats.get('viewCount', 0)),
                Likes=int(stats.get('likeCount', 0)),
                Comments=int(stats.get('commentCount', 0))
            )
            all_video_stats.append(video_stats)
    return pd.DataFrame(all_video_stats)

video_details_df = get_video_details(youtube, video_ids)
video_details_df['Date'] = pd.to_datetime(video_details_df['PublishedDate']).dt.date
top_10 = video_details_df.sort_values(by='Views', ascending=False).head(10)




def engagementRateCalculator():
    totalLikes = video_details_df['Likes'].sum()
    totalComments = video_details_df['Comments'].sum()
    subscribers = channel_df['Subscribers']
    videos = channel_df['VideoCount']
    
    engagement_rate = (((totalComments+totalLikes)/videos)/subscribers)*100
    
    return engagement_rate[0]

print(engagementRateCalculator())