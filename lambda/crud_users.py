import json
import boto3
from botocore.exceptions import ClientError
from decimal import Decimal
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
dynamodb_table = dynamodb.Table('xUser')

def save_user(payload):

    
    try:
        dynamodb_table.put_item(Item=payload)
        body = {
            'Operation': 'SAVE',
            'Message': 'SUCCESS',
            'Item': payload
        }
        return build_response(200, body)
    except ClientError as e:
        print('Error:', e)
        return build_response(400, str(e))
        
        
def delete_user(user_name):
    try:
        response = dynamodb_table.delete_item(
            Key={'user_name': user_name}
        )
        body = {
            'Operation': 'DELETE',
            'Message': 'SUCCESS',
        }
        return build_response(200, body)
    except ClientError as e:
        print('Error:', e)
        return build_response(400, str(e))
        
def get_user(user_name):
    try:
        response = dynamodb_table.get_item(Key={'user_name': user_name})
        item = response.get('Item')
        if item:
            return build_response(200, item)
        else:
            return build_response(404, item)
    except ClientError as e:
        print('Error:', e)
        return build_response(400, str(e))

def get_users():
    try:
        scan_params = {
            'TableName': dynamodb_table.name
        }
        return build_response(200, scan_dynamo_records(scan_params, []))
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])
        
def scan_dynamo_records(scan_params, item_array):
    response = dynamodb_table.scan(**scan_params)
    item_array.extend(response.get('Items', []))
   

    return {'users': item_array}
        
def modify_user(user_name, update_key, update_value):
    print('modify_user method called ',user_name,update_key,update_value)
    try:
        response = dynamodb_table.update_item(
            Key={'user_name': user_name},
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
        return build_response(400, str(e))
        
        
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
        'body': json.dumps(body, cls= DecimalEncoder)
    }