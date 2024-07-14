/*** 

    user = {
        user_name: string,password: string,createTime: number,tweets_id: list,
    }

***/
export async function create(apiSettings,user){
    return await fetch(apiSettings.url + "/user", {
        method: "POST",
        headers: {
            "x-api-key": apiSettings.key,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });
}