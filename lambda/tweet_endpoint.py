
from crud_tweets import *

tweet_path = '/tweet'
user_tweets_path = '/tweet/{user_name}'
user_tweet_path = '/tweet/{user_name}/{creation_time}'

def tweetEndPointHandler(path,pathParameters,http_method,receivedBody):
    
    if http_method == 'GET':
        
        if path == tweet_path:
            return get_all_tweets()
        elif path == user_tweets_path:
            return get_user_tweets(pathParameters['user_name'])
        elif path == user_tweet_path:
            return get_user_tweet(pathParameters['user_name'],int(pathParameters['creation_time']))
        
        
    elif http_method == 'POST':
        
        if path == user_tweet_path:
            return save_tweet(pathParameters['user_name'],int(pathParameters['creation_time']),receivedBody)
        
    elif http_method == 'PATCH':
        
        if path == user_tweet_path:
            
            return update_tweet(pathParameters['user_name'],int(pathParameters['creation_time']),receivedBody['update_key'],receivedBody['update_value'])
        
    elif http_method == 'DELETE':
        
        if path == user_tweet_path:
            return delete_tweet(pathParameters['user_name'],int(pathParameters['creation_time']))