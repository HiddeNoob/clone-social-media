export async function getalltweets(apiSettings){
    return await fetch(apiSettings.url + "/tweet", {
        headers: {
            "x-api-key": apiSettings.key
        }
    });
}

export async function gettweet(apiSettings, user_name,tweet_id){
    return await fetch(apiSettings.url + "/tweet/" + user_name + "/" + tweet_id, {
        headers: {
            "x-api-key": apiSettings.key
        }
    });
}