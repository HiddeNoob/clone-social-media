import json
import boto3
from botocore.exceptions import ClientError
from decimal import Decimal
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
dynamodb_table = dynamodb.Table('xTweet')

def save_tweet(user_name,createTime,request_body):
    print('save_tweet method called ',user_name,createTime,request_body)

    request_body['user_name'] = user_name
    request_body['createTime'] = createTime
    try:
        dynamodb_table.put_item(Item=request_body)
        body = {
            'Operation': 'SAVE',
            'Message': 'SUCCESS',
            'Item': request_body
        }
        return build_response(200, body)
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])
        
        
def delete_tweet(user_name,createTime):
    print('delete_tweet method called ',user_name,createTime)
    try:
        response = dynamodb_table.delete_item(
            Key={
                'user_name': user_name,
                'createTime': createTime
            },
            ReturnValues='ALL_OLD'
        )
        body = {
            'Operation': 'DELETE',
            'Message': 'SUCCESS',
            'Item': response
        }
        return build_response(200, body)
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])
        
def get_user_tweet(user_name,createTime): # get specific tweet
    print('get_user_tweet method called',user_name,createTime)
    try:
        response = dynamodb_table.get_item(
            Key={
                'user_name': user_name,
                'createTime' : createTime
            }
        )
        body = {
            'Operation': 'GET',
            'Message': 'SUCCESS',
            'Item': response.get('Item')
        }
        return build_response(200, body)
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])

def get_all_tweets():
    print('get_all_tweets method called ')
    try:
        scan_params = {
            'TableName': dynamodb_table.name
        }
        return build_response(200, scan_dynamo_records(scan_params))
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])
     
     
def get_user_tweets(user_name):
    print('get_user_tweets method called')
    try:
        response = dynamodb_table.query(
                KeyConditionExpression=Key("user_name").eq(user_name)
        )
    
        return build_response(200,response.get('Items'))
    except ClientError as e:
        print('Error', e)
        return build_response(400,e.response)
    
    
def scan_dynamo_records(scan_params):
    response = dynamodb_table.scan(**scan_params)
    body = {
            'Operation': 'GET',
            'Message': 'SUCCESS',
            'Items': response.get('Items')
        }
    return body
        
def update_tweet(user_name,creation_time ,update_key, update_value):
    print("hello")
    try:
        response = dynamodb_table.update_item(
            Key={
                'user_name': user_name,
                "createTime" : creation_time
                
            },
            UpdateExpression=f'SET {update_key} = :value',
            ExpressionAttributeValues={':value': update_value},
            ReturnValues='UPDATED_NEW'
        )
        body = {
            'Operation': 'UPDATE',
            'Message': 'SUCCESS',
            'UpdatedAttributes': response
        }
        return build_response(200, body)
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e)
        
        
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
    print("building response statusCode :",status_code,"body: ", body)
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps(body, cls=DecimalEncoder)
    }