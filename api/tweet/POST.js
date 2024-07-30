export async function createtweet(apiSettings,user_name,create_time,tweetBody){
    return await fetch(apiSettings.url + "/tweet" + `/${user_name}` + `/${create_time}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiSettings.key
        },
        body: JSON.stringify(tweetBody)
    })
}