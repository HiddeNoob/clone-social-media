import {get,getall} from './user/GET.js';
import {delete_user} from './user/DELETE.js';
import {create} from './user/POST.js';
import {updateuser} from './user/PATCH.js';

import {getalltweets,getusertweet,getusertweets} from './tweet/GET.js';
import {deletetweet} from './tweet/DELETE.js';
import {updatetweet} from './tweet/PATCH.js';
import { createtweet } from './tweet/POST.js';
import apiSettings from './apiSettings.json' with {type: "json"};

export async function getAllUsers() {
   return await getall(apiSettings);
};

export async function getUser(username) {
    return await get(apiSettings, username);
}

export async function updateUser(user_name, update_key, update_value) {
    return await updateuser(apiSettings, user_name, update_key, update_value);
}

export async function deleteUser(username) {
    return await delete_user(apiSettings, username);
}


/** 
    user = {
        user_name: string, password: string, createTime: number, tweets_id: list,
    }
**/
export async function createUser(user) {
    return await create(apiSettings, user);
}

export async function getAllTweets(){
    return await getalltweets(apiSettings);
}

export async function getUserTweets(user_name){
    return await getusertweets(apiSettings, user_name);
}

export async function getUserTweet(user_name, tweet_id){
    return await getusertweet(apiSettings, user_name, tweet_id);
}

export async function updateTweet(user_name, tweet_id, update_key, update_value){
    return await updatetweet(apiSettings, user_name, tweet_id, update_key, update_value);
}

export async function createTweet(user_name, tweet_id, tweet_body){
    return await createtweet(apiSettings, user_name, tweet_id, tweet_body);
}

export async function deleteTweet(user_name, tweet_id){
    return await deletetweet(apiSettings, user_name, tweet_id);
}


