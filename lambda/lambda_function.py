import json
import boto3
from tweet_endpoint import *
from user_endpoint import *
from botocore.exceptions import ClientError
from decimal import Decimal
from boto3.dynamodb.conditions import Key

# Initialize the DynamoDB client


tweet_path = '/tweet'
user_tweets_path = '/tweet/{user_name}'
user_tweet_path = '/tweet/{user_name}/{creation_time}'
user_path = '/user'
certain_user_path = '/user/{user_name}'

def lambda_handler(event, context):
    response = None
   
    try:
        http_method = event.get('httpMethod')
        path = event.get('resource')
        pathParameters = event['pathParameters']
        receivedBody = json.loads(event.get('body')) if event.get('body') else None
        print(http_method,path,pathParameters)
        
        if path == user_path or path == certain_user_path:
            
            response = userEndPointHandler(path,pathParameters,http_method,receivedBody)

        elif path == tweet_path or path == user_tweet_path or path == user_tweets_path:
            response = tweetEndPointHandler(path,pathParameters,http_method,receivedBody)

        else:
            response = build_response(405, "Couldn't find any endpoint")
            

    except Exception as e:
        print('Error:', e)
        response = build_response(400, 'Error processing request Error: ' + str(e))
   
    return response


class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            # Check if it's an int or a float
            if obj % 1 == 0:
                return int(obj)
            else:
                return float(obj)
        # Let the base class default method raise the TypeError
        return super(DecimalEncoder, self).default(obj)

def build_response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps(body, cls=DecimalEncoder)
    }
    