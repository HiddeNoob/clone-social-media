import {getall,get} from './GET.js';
import apiSettings from './apiSettings.json' with {type: "json"};

export async function getAllUsers() {
   return await getall(apiSettings);
};

export async function getUser(username, password) {
    return await get(apiSettings, username, password);
}

export async function getAllTweets() {

    const promise = await getAllUsers();
    const users = await promise.json();
    let tweets = [];
    if(promise.ok){
        (users.response).forEach((user) => {
            user.tweets.forEach((tweet) => {
                tweets.push(tweet);
            });
        });
    }else if(promise.status == 429){
        throw new Error('Too many requests');
    }
    return tweets;
    
}