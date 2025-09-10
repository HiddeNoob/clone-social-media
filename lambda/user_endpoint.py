from crud_users import *

user_path = '/user'
certain_user_path = '/user/{user_name}'

def userEndPointHandler(path,pathParameters,http_method,receivedBody):
    
    if http_method == 'GET':
            
        if path == user_path:
            return get_users()
        elif path == certain_user_path:
            return get_user(pathParameters['user_name'])
        
    elif http_method == 'POST':
        
        if path == user_path:
            return save_user(receivedBody)
        
    elif http_method == 'PATCH':
        if path == user_path:
            return modify_user(receivedBody['user_name'],receivedBody['update_key'],receivedBody['update_value'])        
    elif http_method == 'DELETE':
        
        if path == certain_user_path:
            return delete_user(pathParameters['user_name'])
        
    