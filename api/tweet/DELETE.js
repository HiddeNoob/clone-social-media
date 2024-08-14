export async function deletetweet(apiSettings, user_name,tweet_id){
    return await fetch(apiSettings.url + "/tweet/" + user_name + "/" + tweet_id, {
        method: 'DELETE',
        headers: {
            "x-api-key": apiSettings.key
        }
    });
}